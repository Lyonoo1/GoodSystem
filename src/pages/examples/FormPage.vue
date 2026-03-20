<template>
  <div class="starfield-page" @mousemove="onMouseMove">
    <!-- 星空画布 -->
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>

    <!-- 破碎玻璃纹理 -->
    <div class="shatter-overlay"></div>

    <!-- 流星 -->
    <div class="meteor meteor-1"></div>
    <div class="meteor meteor-2"></div>
    <div class="meteor meteor-3"></div>

    <!-- 星云光晕 -->
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>

    <!-- 页面内容 -->
    <div class="sf-container">
      <!-- 标题 -->
      <div class="sf-header">
        <div class="sf-breadcrumb">
          <span class="bc-item">SYSTEM</span>
          <span class="bc-sep">▸</span>
          <span class="bc-item">CONFIGURE</span>
          <span class="bc-sep">▸</span>
          <span class="bc-item active">ENTITY_FORM</span>
        </div>
        <h1 class="sf-title">
          <span class="title-star">✦</span>
          <span class="title-text">STELLAR<span class="title-accent"> CONFIG</span></span>
          <span class="title-star">✦</span>
        </h1>
        <p class="sf-subtitle">INITIALIZING FORM MODULE · COSMIC DATA INPUT TERMINAL</p>
      </div>

      <!-- 破碎面板主体 -->
      <div class="shard-panel" :style="panelStyle">
        <!-- 顶部光线 -->
        <div class="shard-top-glow"></div>

        <!-- 破碎纹角 -->
        <svg class="shard-svg tl" viewBox="0 0 80 80"><polygon points="0,0 80,0 0,80" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.4)" stroke-width="1"/></svg>
        <svg class="shard-svg tr" viewBox="0 0 80 80"><polygon points="80,0 0,0 80,80" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.4)" stroke-width="1"/></svg>
        <svg class="shard-svg bl" viewBox="0 0 80 80"><polygon points="0,80 80,80 0,0" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.3)" stroke-width="1"/></svg>
        <svg class="shard-svg br" viewBox="0 0 80 80"><polygon points="80,80 0,80 80,0" fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.3)" stroke-width="1"/></svg>

        <!-- 面板状态行 -->
        <div class="panel-status-row">
          <span class="ps-dot pulse"></span>
          <span class="ps-text">FORM READY</span>
          <span class="ps-divider">|</span>
          <span class="ps-text dim">COSMIC TERMINAL v3.1</span>
          <span class="ps-spacer"></span>
          <span class="ps-coord">{{ coordText }}</span>
        </div>

        <!-- 表单 -->
        <el-form ref="formRef" :model="form" :rules="rules" class="star-form">

          <!-- 名称 -->
          <div class="sf-field" :class="{ active: focused === 'name' }">
            <div class="field-label-row">
              <span class="field-index">01</span>
              <span class="field-label">ENTITY NAME</span>
              <span class="field-req">* REQUIRED</span>
            </div>
            <div class="field-input-wrap" :class="{ error: !!fieldErrors.name }">
              <span class="field-icon">◈</span>
              <input
                v-model="form.name"
                class="sf-input"
                placeholder="输入实体名称..."
                @focus="focused = 'name'"
                @blur="onBlur('name')"
              />
              <span class="field-glow-line"></span>
            </div>
            <div v-if="fieldErrors.name" class="field-error">
              <span class="err-icon">⚠</span> {{ fieldErrors.name }}
            </div>
          </div>

          <!-- 类型 -->
          <div class="sf-field" :class="{ active: focused === 'type' }">
            <div class="field-label-row">
              <span class="field-index">02</span>
              <span class="field-label">ENTITY TYPE</span>
              <span class="field-req">* REQUIRED</span>
            </div>
            <div class="field-input-wrap sf-select-wrap" :class="{ error: !!fieldErrors.type }">
              <span class="field-icon">⬡</span>
              <div class="sf-select-box" @click="toggleSelect">
                <span :class="form.type ? 'sel-value' : 'sel-placeholder'">
                  {{ form.type ? typeOptions.find(o=>o.value===form.type)?.label : '选择类型...' }}
                </span>
                <span class="sel-arrow" :class="{ open: selectOpen }">▾</span>
              </div>
              <div class="sf-dropdown" v-if="selectOpen">
                <div
                  v-for="opt in typeOptions"
                  :key="opt.value"
                  class="sf-option"
                  :class="{ selected: form.type === opt.value }"
                  @click="selectType(opt.value)"
                >
                  <span class="opt-mark">{{ form.type === opt.value ? '✦' : '◇' }}</span>
                  {{ opt.label }}
                </div>
              </div>
              <span class="field-glow-line"></span>
            </div>
            <div v-if="fieldErrors.type" class="field-error">
              <span class="err-icon">⚠</span> {{ fieldErrors.type }}
            </div>
          </div>

          <!-- 启用 -->
          <div class="sf-field">
            <div class="field-label-row">
              <span class="field-index">03</span>
              <span class="field-label">SYSTEM STATUS</span>
            </div>
            <div class="toggle-wrap">
              <div class="star-toggle" :class="{ on: form.enabled }" @click="form.enabled = !form.enabled">
                <div class="toggle-track">
                  <div class="toggle-thumb">
                    <span class="thumb-icon">{{ form.enabled ? '✦' : '◇' }}</span>
                  </div>
                  <span class="track-label on-label">ACTIVE</span>
                  <span class="track-label off-label">INACTIVE</span>
                </div>
              </div>
              <span class="toggle-status" :class="form.enabled ? 'text-active' : 'text-inactive'">
                {{ form.enabled ? '◉ 系统在线运行中' : '○ 系统已停用' }}
              </span>
            </div>
          </div>

          <!-- 备注 -->
          <div class="sf-field" :class="{ active: focused === 'remark' }">
            <div class="field-label-row">
              <span class="field-index">04</span>
              <span class="field-label">MISSION NOTES</span>
              <span class="field-opt">OPTIONAL</span>
            </div>
            <div class="field-input-wrap textarea-wrap">
              <span class="field-icon top">✎</span>
              <textarea
                v-model="form.remark"
                class="sf-textarea"
                rows="3"
                placeholder="备注信息（可选）..."
                @focus="focused = 'remark'"
                @blur="focused = ''"
              ></textarea>
              <span class="field-glow-line"></span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="sf-actions">
            <button class="sf-btn reset" @click="reset">
              <span class="sbtn-icon">↺</span>
              RESET
              <div class="sbtn-particles"></div>
            </button>
            <button class="sf-btn submit" @click="submit">
              <span class="sbtn-shine"></span>
              <span class="sbtn-icon">▶</span>
              LAUNCH
              <div class="sbtn-ripple" :class="{ active: ripple }" @animationend="ripple = false"></div>
            </button>
          </div>

        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormPage',
  data() {
    return {
      focused: '',
      selectOpen: false,
      ripple: false,
      mouseX: 0,
      mouseY: 0,
      coordText: 'X:000 Y:000',
      form: { name: '', type: '', enabled: true, remark: '' },
      fieldErrors: { name: '', type: '' },
      typeOptions: [
        { value: 'A', label: '类型 A · ALPHA UNIT' },
        { value: 'B', label: '类型 B · BETA UNIT' },
      ],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
      },
    }
  },
  computed: {
    panelStyle() {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (this.mouseX - cx) / cx
      const dy = (this.mouseY - cy) / cy
      return {
        transform: `perspective(1200px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`,
      }
    },
  },
  mounted() {
    this.initStars()
    document.addEventListener('click', this.closeSelect)
  },
  beforeDestroy() {
    if (this._animFrame) cancelAnimationFrame(this._animFrame)
    document.removeEventListener('click', this.closeSelect)
  },
  methods: {
    onMouseMove(e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.coordText = `X:${String(e.clientX).padStart(3,'0')} Y:${String(e.clientY).padStart(3,'0')}`
    },

    closeSelect(e) {
      if (!e.target.closest('.sf-select-wrap')) this.selectOpen = false
    },

    toggleSelect() {
      this.selectOpen = !this.selectOpen
      this.focused = 'type'
    },

    selectType(val) {
      this.form.type = val
      this.selectOpen = false
      this.fieldErrors.type = ''
    },

    onBlur(field) {
      this.focused = ''
      if (field === 'name' && !this.form.name) this.fieldErrors.name = '请输入名称'
      else if (field === 'name') this.fieldErrors.name = ''
    },

    validate() {
      let ok = true
      if (!this.form.name) { this.fieldErrors.name = '请输入名称'; ok = false }
      else this.fieldErrors.name = ''
      if (!this.form.type) { this.fieldErrors.type = '请选择类型'; ok = false }
      else this.fieldErrors.type = ''
      return ok
    },

    async submit() {
      if (!this.validate()) return
      this.ripple = true
      await new Promise(r => setTimeout(r, 300))
      this.$message.success('提交成功（示例）')
    },

    reset() {
      this.form = { name: '', type: '', enabled: true, remark: '' }
      this.fieldErrors = { name: '', type: '' }
      this.selectOpen = false
    },

    initStars() {
      const canvas = this.$refs.starsCanvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.1,
        alpha: Math.random() * 0.8 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.7 ? '139,92,246' : Math.random() > 0.5 ? '56,189,248' : '255,255,255',
      }))

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        stars.forEach(s => {
          s.twinkle += s.speed
          const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle))
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${s.color},${a})`
          ctx.fill()
        })
        this._animFrame = requestAnimationFrame(draw)
      }
      draw()
    },
  },
}
</script>

<style lang="scss" scoped>
$purple: #8b5cf6;
$sky: #38bdf8;
$pink: #ec4899;
$dark: #04060f;
$panel-bg: rgba(6, 10, 24, 0.88);
$border-p: rgba(139, 92, 246, 0.35);
$border-s: rgba(56, 189, 248, 0.3);

.starfield-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $dark;
  position: relative;
  overflow: hidden;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
}

.stars-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

// 破碎玻璃纹理
.shatter-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(135deg, rgba(139,92,246,0.03) 25%, transparent 25%),
    linear-gradient(225deg, rgba(56,189,248,0.03) 25%, transparent 25%),
    linear-gradient(315deg, rgba(139,92,246,0.03) 25%, transparent 25%),
    linear-gradient(45deg,  rgba(56,189,248,0.03) 25%, transparent 25%);
  background-size: 80px 80px;
}

// 流星
.meteor {
  position: fixed;
  height: 1px;
  background: linear-gradient(90deg, transparent, $sky, transparent);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  border-radius: 50%;
}
.meteor-1 { width: 200px; top: 15%; left: -200px; animation: meteorFly 8s linear infinite 1s; }
.meteor-2 { width: 120px; top: 35%; left: -200px; animation: meteorFly 11s linear infinite 4s; }
.meteor-3 { width: 160px; top: 60%; left: -200px; animation: meteorFly 7s linear infinite 7s; }

@keyframes meteorFly {
  0%   { left: -200px; opacity: 0; }
  5%   { opacity: 0.8; }
  95%  { opacity: 0.6; }
  100% { left: 110%; opacity: 0; }
}

// 星云
.nebula {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(100px);
}
.nebula-1 {
  width: 500px; height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%);
  top: -10%; left: -10%;
  animation: nebulaFloat 14s ease-in-out infinite;
}
.nebula-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(56,189,248,0.1), transparent 70%);
  bottom: -5%; right: -5%;
  animation: nebulaFloat 18s ease-in-out infinite reverse;
}
@keyframes nebulaFloat {
  0%,100% { transform: translate(0,0); }
  50%      { transform: translate(20px,-30px); }
}

// ── 内容容器 ──────────────────────────────
.sf-container {
  position: relative;
  z-index: 10;
  width: 540px;
  padding: 20px 0;
}

// ── 标题 ──────────────────────────────────
.sf-header {
  text-align: center;
  margin-bottom: 24px;
}

.sf-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  margin-bottom: 12px;

  .bc-item { color: rgba(139,92,246,0.5); letter-spacing: 1px; }
  .bc-item.active { color: $sky; }
  .bc-sep { color: rgba(255,255,255,0.2); }
}

.sf-title {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 4px;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .title-star {
    color: $purple;
    font-size: 16px;
    animation: starSpin 4s linear infinite;
    display: inline-block;
  }
  .title-text {
    color: #e2e8f0;
    text-shadow: 0 0 30px rgba(139,92,246,0.4);
  }
  .title-accent {
    background: linear-gradient(135deg, $purple, $sky);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
@keyframes starSpin {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

.sf-subtitle {
  font-size: 10px;
  letter-spacing: 2.5px;
  color: rgba(56,189,248,0.4);
  margin: 0;
}

// ── 主面板 ──────────────────────────────────
.shard-panel {
  background: $panel-bg;
  border: 1px solid $border-p;
  border-radius: 16px;
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow:
    0 0 0 1px rgba(139,92,246,0.1),
    0 0 60px rgba(139,92,246,0.08),
    0 30px 80px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(139,92,246,0.15);
  transition: transform 0.08s ease;
  will-change: transform;
}

.shard-top-glow {
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, $purple, $sky, transparent);
}

.shard-svg {
  position: absolute;
  width: 80px; height: 80px;
  pointer-events: none;
  &.tl { top: 0; left: 0; }
  &.tr { top: 0; right: 0; transform: scaleX(-1); }
  &.bl { bottom: 0; left: 0; }
  &.br { bottom: 0; right: 0; transform: scale(-1); }
}

// 面板状态行
.panel-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: rgba(56,189,248,0.5);
  letter-spacing: 1px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(139,92,246,0.12);
}

.ps-dot {
  width: 6px; height: 6px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px #22c55e;
  &.pulse { animation: psDotPulse 2s ease-in-out infinite; }
}
@keyframes psDotPulse {
  0%,100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
.ps-text { color: rgba(56,189,248,0.6); }
.ps-text.dim { color: rgba(255,255,255,0.2); }
.ps-divider { color: rgba(255,255,255,0.1); }
.ps-spacer { flex: 1; }
.ps-coord { color: rgba(139,92,246,0.4); font-size: 9px; font-variant-numeric: tabular-nums; }

// ── 表单字段 ──────────────────────────────────
.star-form { display: flex; flex-direction: column; gap: 20px; }

.sf-field {
  position: relative;

  &.active .field-glow-line { opacity: 1; transform: scaleX(1); }
  &.active .field-input-wrap { border-color: $purple; box-shadow: 0 0 0 2px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.1); }
}

.field-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.field-index {
  font-size: 9px;
  color: rgba(139,92,246,0.4);
  background: rgba(139,92,246,0.08);
  padding: 1px 6px;
  border-radius: 2px;
  border: 1px solid rgba(139,92,246,0.2);
}

.field-label {
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(56,189,248,0.7);
}

.field-req {
  font-size: 9px;
  color: $pink;
  letter-spacing: 1px;
  opacity: 0.7;
}

.field-opt {
  font-size: 9px;
  color: rgba(255,255,255,0.25);
  letter-spacing: 1px;
}

.field-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(139,92,246,0.25);
  border-radius: 8px;
  background: rgba(139,92,246,0.04);
  padding: 0 14px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;

  &.error {
    border-color: rgba(236,72,153,0.5);
    background: rgba(236,72,153,0.04);
  }

  &.textarea-wrap {
    align-items: flex-start;
    padding-top: 12px;
    padding-bottom: 12px;
    .field-icon.top { margin-top: 1px; }
  }
}

.field-icon {
  color: rgba(139,92,246,0.5);
  font-size: 14px;
  flex-shrink: 0;
}

.field-glow-line {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, $purple, $sky);
  transform: scaleX(0);
  opacity: 0;
  transition: all 0.3s ease;
  transform-origin: left;
}

.sf-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e2e8f0;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
  height: 42px;

  &::placeholder { color: rgba(255,255,255,0.2); }
}

.sf-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e2e8f0;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
  resize: none;
  line-height: 1.6;

  &::placeholder { color: rgba(255,255,255,0.2); }
}

.field-error {
  margin-top: 5px;
  font-size: 11px;
  color: $pink;
  display: flex;
  align-items: center;
  gap: 5px;
  .err-icon { font-size: 12px; }
}

// Select
.sf-select-wrap { cursor: pointer; position: relative; }

.sf-select-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  height: 42px;

  .sel-placeholder { color: rgba(255,255,255,0.2); font-size: 13px; font-family: 'SF Mono', monospace; }
  .sel-value { color: #e2e8f0; font-size: 13px; font-family: 'SF Mono', monospace; }
  .sel-arrow {
    color: rgba(139,92,246,0.6);
    transition: transform 0.2s;
    &.open { transform: rotate(180deg); }
  }
}

.sf-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: rgba(8, 12, 28, 0.98);
  border: 1px solid $border-p;
  border-radius: 8px;
  z-index: 50;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1);
}

.sf-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'SF Mono', monospace;

  .opt-mark { color: rgba(139,92,246,0.5); width: 14px; }

  &:hover { background: rgba(139,92,246,0.1); color: #e2e8f0; .opt-mark { color: $purple; } }
  &.selected { color: $sky; background: rgba(56,189,248,0.06); .opt-mark { color: $sky; } }
}

// Toggle
.toggle-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.star-toggle {
  cursor: pointer;
  .toggle-track {
    width: 100px; height: 34px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    padding: 0 8px;
    justify-content: space-between;
  }
  &.on .toggle-track {
    background: rgba(139,92,246,0.15);
    border-color: $purple;
    box-shadow: 0 0 15px rgba(139,92,246,0.2);
  }

  .toggle-thumb {
    position: absolute;
    width: 26px; height: 26px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    left: 4px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    .thumb-icon { font-size: 10px; color: rgba(255,255,255,0.5); }
  }
  &.on .toggle-thumb {
    left: calc(100% - 30px);
    background: linear-gradient(135deg, $purple, $sky);
    border-color: $sky;
    box-shadow: 0 0 10px rgba(56,189,248,0.4);
    .thumb-icon { color: #fff; }
  }

  .track-label {
    font-size: 9px;
    letter-spacing: 1px;
    font-family: 'SF Mono', monospace;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }
  .on-label  { color: rgba(139,92,246,0.3); margin-left: auto; padding-right: 2px; }
  .off-label { color: rgba(255,255,255,0.3); margin-right: auto; padding-left: 2px; }
  &.on .on-label  { color: $sky; }
  &.on .off-label { color: rgba(255,255,255,0.15); }
}

.toggle-status {
  font-size: 11px;
  letter-spacing: 1px;
  font-family: 'SF Mono', monospace;
  &.text-active  { color: #34d399; }
  &.text-inactive { color: rgba(255,255,255,0.3); }
}

// ── 操作按钮 ──────────────────────────────────
.sf-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.sf-btn {
  flex: 1;
  height: 46px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .sbtn-icon { font-size: 13px; }

  &.reset {
    background: transparent;
    color: rgba(255,255,255,0.4);
    border: 1px solid rgba(255,255,255,0.15);
    flex: 0 0 120px;
    &:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); }
  }

  &.submit {
    background: linear-gradient(135deg, #4c1d95, #6d28d9, #7c3aed);
    color: #e9d5ff;
    border: 1px solid rgba(139,92,246,0.5);
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #5b21b6, #8b5cf6, #a78bfa);
      opacity: 0;
      transition: opacity 0.3s;
    }
    &:hover::before { opacity: 1; }
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139,92,246,0.4); }
    &:active { transform: translateY(0); }
  }

  .sbtn-shine {
    position: absolute;
    top: 0; left: -80%;
    width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transform: skewX(-20deg);
    animation: btnShine 4s ease-in-out infinite;
  }
}

@keyframes btnShine {
  0%   { left: -80%; }
  40%  { left: 130%; }
  100% { left: 130%; }
}

.sbtn-ripple {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255,255,255,0.15);
  transform: scale(0);
  opacity: 0;
  &.active {
    animation: rippleAnim 0.4s ease-out forwards;
  }
}
@keyframes rippleAnim {
  to { transform: scale(2.5); opacity: 0; }
}
</style>
