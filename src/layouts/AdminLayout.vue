<template>
  <div class="layout">
    <aside class="sidebar" :class="{ collapsed }">
      <div class="logo">
        <span class="logo-badge">G</span>
        <span class="logo-text" v-if="!collapsed">GPT_WEB</span>
      </div>
      <Sidebar :collapsed="collapsed" />
    </aside>

    <section class="main">
      <header class="header">
        <div class="header-left">
          <button
            class="icon-btn"
            type="button"
            @click="toggle"
            :aria-label="collapsed ? '展开侧边栏' : '收起侧边栏'"
          >
            <span class="burger">☰</span>
          </button>
          <Breadcrumb />
        </div>
        <HeaderBar />
      </header>

      <main class="content">
        <div class="content-inner">
          <router-view />
        </div>
      </main>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/HeaderBar.vue'
import Breadcrumb from './components/Breadcrumb.vue'

export default {
  name: 'AdminLayout',
  components: { Sidebar, HeaderBar, Breadcrumb },
  computed: {
    ...mapState('app', ['sidebarCollapsed']),
    collapsed() {
      return this.sidebarCollapsed
    },
  },
  methods: {
    ...mapMutations('app', ['toggleSidebar']),
    toggle() {
      this.toggleSidebar()
    },
  },
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
}

.sidebar {
  width: var(--app-sidebar-width);
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar.collapsed {
  width: var(--app-sidebar-collapsed-width);
}

.logo {
  height: var(--app-header-height);
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-weight: 700;
  gap: 10px;
  letter-spacing: 0.2px;
}

.logo-badge {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1677ff 0%, #00c2ff 60%, #6be3ff 100%);
  box-shadow: 0 8px 16px rgba(22, 119, 255, 0.22);
  color: #fff;
}

.logo-text {
  font-size: 14px;
  opacity: 0.95;
  white-space: nowrap;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  height: var(--app-header-height);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid var(--app-border);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--app-border);
  background: #fff;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.icon-btn:hover {
  background: rgba(31, 35, 41, 0.03);
  box-shadow: var(--app-shadow-sm);
}

.icon-btn:active {
  transform: translateY(1px);
}

.burger {
  font-size: 16px;
  line-height: 1;
}

.content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  background: var(--app-bg);
}

.content-inner {
  min-height: calc(100vh - var(--app-header-height) - 32px);
  padding: 2px;
}
</style>

