<template>
  <div class="mecha-page">
    <!-- 背景装饰 -->
    <div class="bg-grid"></div>
    <div class="bg-scanline"></div>
    <div class="hex-pattern"></div>

    <!-- 页头 -->
    <div class="mecha-head">
      <div class="head-left">
        <div class="imperial-badge">
          <span class="badge-icon">⬡</span>
          <span class="badge-text">IMPERIAL COMMAND</span>
          <span class="badge-icon">⬡</span>
        </div>
        <div class="mecha-title">
          <span class="title-bracket">[</span>
          列表指挥中心
          <span class="title-bracket">]</span>
        </div>
        <div class="mecha-desc">TACTICAL OPERATIONS · DATA ARRAY · UNIT CONTROL SYSTEM</div>
      </div>
      <div class="head-right">
        <div class="stat-block">
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">TOTAL UNITS</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <div class="stat-value online">{{ rows.filter(r => r.status === '启用').length }}</div>
          <div class="stat-label">ONLINE</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <div class="stat-value offline">{{ rows.filter(r => r.status === '禁用').length }}</div>
          <div class="stat-label">OFFLINE</div>
        </div>
      </div>
    </div>

    <!-- 主面板 -->
    <div class="mecha-panel">
      <!-- 面板顶部装饰条 -->
      <div class="panel-header">
        <div class="panel-header-left">
          <span class="panel-dot red"></span>
          <span class="panel-dot yellow"></span>
          <span class="panel-dot green"></span>
          <span class="panel-title-text">// UNIT_DATABASE.sys</span>
        </div>
        <div class="panel-header-right">
          <span class="panel-tag">REV.2.0</span>
          <span class="panel-tag active">LIVE</span>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="mecha-toolbar">
        <div class="search-wrap">
          <span class="search-icon">◎</span>
          <el-input
            v-model="query.keyword"
            placeholder="SEARCH UNIT ID / NAME..."
            clearable
            class="mecha-input"
            style="width: 280px"
          />
        </div>
        <button class="mecha-btn primary" @click="onSearch">
          <span class="btn-sym">▶</span> SCAN
        </button>
        <button class="mecha-btn ghost" @click="onReset">
          <span class="btn-sym">↺</span> RESET
        </button>
        <div class="spacer"></div>
        <button class="mecha-btn gold" @click="onCreate">
          <span class="btn-sym">✦</span> DEPLOY NEW UNIT
        </button>
      </div>

      <!-- 表格 -->
      <div class="mecha-table-wrap">
        <table class="mecha-table">
          <thead>
            <tr>
              <th><span class="th-inner"><span class="th-mark">◈</span> UNIT ID</span></th>
              <th><span class="th-inner"><span class="th-mark">◈</span> DESIGNATION</span></th>
              <th><span class="th-inner"><span class="th-mark">◈</span> COMBAT STATUS</span></th>
              <th><span class="th-inner"><span class="th-mark">◈</span> OPERATIONS</span></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in rows"
              :key="row.id"
              class="mecha-row"
              :class="{ even: idx % 2 === 0 }"
              @click="selectedRow = row.id"
              :style="{ animationDelay: idx * 30 + 'ms' }"
            >
              <td>
                <span class="id-cell">
                  <span class="id-prefix">0x</span>{{ row.id }}
                </span>
              </td>
              <td>
                <span class="name-cell">{{ row.name }}</span>
              </td>
              <td>
                <span class="status-badge" :class="row.status === '启用' ? 'active' : 'inactive'">
                  <span class="status-light"></span>
                  {{ row.status === '启用' ? 'ONLINE' : 'OFFLINE' }}
                </span>
              </td>
              <td>
                <div class="ops-wrap">
                  <button class="op-btn view" @click.stop="view(row)">
                    <span>◉</span> VIEW
                  </button>
                  <button class="op-btn edit" @click.stop="edit(row)">
                    <span>✎</span> EDIT
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="mecha-pager">
        <div class="pager-info">
          PAGE {{ query.page }} / {{ Math.ceil(total / query.pageSize) }} · {{ total }} RECORDS
        </div>
        <div class="pager-controls">
          <button class="page-btn" :disabled="query.page <= 1" @click="onPage(query.page - 1)">◀ PREV</button>
          <button
            v-for="p in pageNumbers"
            :key="p"
            class="page-btn num"
            :class="{ active: p === query.page }"
            @click="onPage(p)"
          >{{ p }}</button>
          <button class="page-btn" :disabled="query.page >= Math.ceil(total / query.pageSize)" @click="onPage(query.page + 1)">NEXT ▶</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListPage',
  data() {
    return {
      query: { keyword: '', page: 1, pageSize: 10 },
      total: 0,
      rows: [],
      selectedRow: null,
    }
  },
  computed: {
    pageNumbers() {
      const total = Math.ceil(this.total / this.query.pageSize)
      const cur = this.query.page
      const pages = []
      for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.push(i)
      return pages
    },
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      const all = Array.from({ length: 57 }).map((_, i) => ({
        id: `R${String(i + 1).padStart(3, '0')}`,
        name: `记录 ${i + 1}`,
        status: i % 3 === 0 ? '禁用' : '启用',
      }))
      const filtered = this.query.keyword
        ? all.filter((x) => x.name.includes(this.query.keyword) || x.id.includes(this.query.keyword))
        : all
      this.total = filtered.length
      const start = (this.query.page - 1) * this.query.pageSize
      this.rows = filtered.slice(start, start + this.query.pageSize)
    },
    onSearch() { this.query.page = 1; this.fetch() },
    onReset() { this.query.keyword = ''; this.query.page = 1; this.fetch() },
    onPage(p) { this.query.page = p; this.fetch() },
    onSize(s) { this.query.pageSize = s; this.query.page = 1; this.fetch() },
    view(row) { this.$message.info(`查看 ${row.id}`) },
    edit(row) { this.$message.success(`编辑 ${row.id}`) },
    onCreate() { this.$message.success('新建（示例）') },
  },
}
</script>

<style lang="scss" scoped>
// ── 变量 ──────────────────────────────────
$gold: #c9a227;
$gold-light: #f0c94d;
$iron: #8a9bb0;
$dark: #080c12;
$panel-bg: rgba(10, 16, 28, 0.95);
$border: rgba(180, 140, 30, 0.3);
$border-bright: rgba(201, 162, 39, 0.7);
$red-status: #ff4d4d;
$green-status: #39ff8e;

// ── 全局容器 ──────────────────────────────
.mecha-page {
  min-height: 100%;
  padding: 20px;
  background: $dark;
  position: relative;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  color: #c8d6e8;
  overflow: hidden;
}

// ── 背景 ──────────────────────────────────
.bg-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: 0;
}

.bg-scanline {
  position: fixed;
  left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent);
  z-index: 1;
  animation: scanDown 8s linear infinite;
  pointer-events: none;
}
@keyframes scanDown {
  0%   { top: -3px; }
  100% { top: 100vh; }
}

.hex-pattern {
  position: fixed;
  top: -20%; right: -10%;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: hexPulse 6s ease-in-out infinite;
}
@keyframes hexPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.08); opacity: 0.7; }
}

// ── 页头 ──────────────────────────────────
.mecha-head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid $border;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 40%;
    height: 1px;
    background: linear-gradient(90deg, $gold, transparent);
  }
}

.imperial-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 3px;
  color: $gold;
  margin-bottom: 8px;
}

.badge-icon { color: $gold-light; font-size: 12px; }

.mecha-title {
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(201,162,39,0.5);
  margin-bottom: 4px;
}

.title-bracket {
  color: $gold;
  font-weight: 300;
}

.mecha-desc {
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(201,162,39,0.5);
}

.head-right {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(201,162,39,0.05);
  border: 1px solid $border;
  border-radius: 8px;
  overflow: hidden;
}

.stat-block {
  padding: 10px 20px;
  text-align: center;
  .stat-value {
    font-size: 20px;
    font-weight: 900;
    color: $gold-light;
    line-height: 1;
    &.online { color: $green-status; text-shadow: 0 0 8px $green-status; }
    &.offline { color: $red-status; text-shadow: 0 0 8px $red-status; }
  }
  .stat-label {
    font-size: 9px;
    letter-spacing: 2px;
    color: rgba(201,162,39,0.5);
    margin-top: 3px;
  }
}

.stat-divider {
  width: 1px; height: 36px;
  background: $border;
}

// ── 主面板 ──────────────────────────────────
.mecha-panel {
  position: relative;
  z-index: 2;
  background: $panel-bg;
  border: 1px solid $border;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(201,162,39,0.08), 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,162,39,0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(201,162,39,0.06);
  border-bottom: 1px solid $border;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  &.red    { background: #ff5f57; }
  &.yellow { background: #ffbd2e; }
  &.green  { background: #28ca41; }
}

.panel-title-text {
  font-size: 11px;
  color: rgba(201,162,39,0.5);
  letter-spacing: 1px;
}

.panel-header-right { display: flex; gap: 6px; }
.panel-tag {
  font-size: 9px;
  letter-spacing: 2px;
  padding: 2px 8px;
  border: 1px solid rgba(201,162,39,0.3);
  border-radius: 3px;
  color: rgba(201,162,39,0.5);
  &.active {
    color: $green-status;
    border-color: rgba(57,255,142,0.4);
    background: rgba(57,255,142,0.06);
    animation: tagBlink 2s ease-in-out infinite;
  }
}
@keyframes tagBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

// ── 工具栏 ──────────────────────────────────
.mecha-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(201,162,39,0.12);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(201,162,39,0.04);
  border: 1px solid rgba(201,162,39,0.2);
  border-radius: 6px;
  padding: 0 10px;

  .search-icon { color: rgba(201,162,39,0.5); font-size: 14px; }
}

.mecha-input {
  :deep(.el-input__wrapper) {
    background: transparent !important;
    box-shadow: none !important;
    border: none;
    padding: 0 8px;
  }
  :deep(.el-input__inner) {
    background: transparent;
    color: #c8d6e8;
    font-family: inherit;
    font-size: 12px;
    height: 36px;
    &::placeholder { color: rgba(201,162,39,0.3); }
  }
}

.mecha-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 36px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  .btn-sym { font-size: 12px; }

  &.primary {
    background: linear-gradient(135deg, #1a3a6b, #2563eb);
    color: #93c5fd;
    border: 1px solid rgba(37,99,235,0.5);
    &:hover { background: linear-gradient(135deg, #2563eb, #3b82f6); box-shadow: 0 0 20px rgba(37,99,235,0.4); }
  }

  &.ghost {
    background: transparent;
    color: $iron;
    border: 1px solid rgba(138,155,176,0.3);
    &:hover { color: #c8d6e8; border-color: rgba(138,155,176,0.6); }
  }

  &.gold {
    background: linear-gradient(135deg, #78450a, $gold);
    color: #fff8e1;
    border: 1px solid rgba(201,162,39,0.6);
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    &:hover {
      background: linear-gradient(135deg, $gold, $gold-light);
      box-shadow: 0 0 24px rgba(201,162,39,0.5);
      transform: translateY(-1px);
    }
  }
}

.spacer { flex: 1; }

// ── 表格 ──────────────────────────────────
.mecha-table-wrap {
  overflow-x: auto;
  padding: 0 20px;
}

.mecha-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  thead tr {
    border-bottom: 1px solid $border;
  }

  th {
    padding: 12px 14px;
    text-align: left;
    font-weight: 400;

    .th-inner {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      letter-spacing: 2px;
      color: rgba(201,162,39,0.6);
    }
    .th-mark { color: $gold; }
  }

  .mecha-row {
    border-bottom: 1px solid rgba(201,162,39,0.07);
    transition: all 0.2s ease;
    cursor: pointer;
    animation: rowSlideIn 0.3s ease both;

    &.even { background: rgba(201,162,39,0.02); }
    &:hover {
      background: rgba(201,162,39,0.07) !important;
      td:first-child { border-left: 2px solid $gold; }
    }

    td {
      padding: 12px 14px;
      border-left: 2px solid transparent;
      transition: border-color 0.2s;
    }
  }
}

@keyframes rowSlideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.id-cell {
  font-family: inherit;
  .id-prefix { color: rgba(201,162,39,0.4); font-size: 10px; }
  color: $gold-light;
  font-weight: 700;
}

.name-cell { color: #c8d6e8; }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 700;

  .status-light {
    width: 6px; height: 6px;
    border-radius: 50%;
    animation: statusPulse 2s ease-in-out infinite;
  }

  &.active {
    color: $green-status;
    background: rgba(57,255,142,0.08);
    border: 1px solid rgba(57,255,142,0.25);
    .status-light { background: $green-status; box-shadow: 0 0 6px $green-status; }
  }

  &.inactive {
    color: #ff6b6b;
    background: rgba(255,77,77,0.08);
    border: 1px solid rgba(255,77,77,0.2);
    .status-light { background: $red-status; box-shadow: 0 0 6px $red-status; }
  }
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.ops-wrap { display: flex; gap: 8px; }

.op-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 10px;
  letter-spacing: 1px;
  font-family: inherit;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 700;

  &.view {
    background: transparent;
    color: #63b3ed;
    border: 1px solid rgba(99,179,237,0.3);
    &:hover { background: rgba(99,179,237,0.1); box-shadow: 0 0 10px rgba(99,179,237,0.2); }
  }
  &.edit {
    background: transparent;
    color: $gold;
    border: 1px solid rgba(201,162,39,0.3);
    &:hover { background: rgba(201,162,39,0.1); box-shadow: 0 0 10px rgba(201,162,39,0.2); }
  }
}

// ── 分页 ──────────────────────────────────
.mecha-pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid rgba(201,162,39,0.12);
}

.pager-info {
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(201,162,39,0.4);
}

.pager-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 5px 12px;
  background: transparent;
  color: $iron;
  border: 1px solid rgba(138,155,176,0.25);
  border-radius: 3px;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) { color: $gold; border-color: rgba(201,162,39,0.5); }
  &.active { background: rgba(201,162,39,0.15); color: $gold-light; border-color: $gold; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }

  &.num { min-width: 32px; text-align: center; }
}
</style>
