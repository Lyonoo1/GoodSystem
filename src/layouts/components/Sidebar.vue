<template>
  <el-menu
    class="menu"
    :default-active="activePath"
    :collapse="collapsed"
    :collapse-transition="false"
    background-color="#001529"
    text-color="#bfcbd9"
    active-text-color="#ffffff"
    router
  >
    <template v-for="item in menu" :key="item.path">
      <el-submenu v-if="item.children && item.children.length" :index="item.path">
        <template #title>
          <span class="mini-ico">{{ abbr(item.title) }}</span>
          <span class="title-text">{{ item.title }}</span>
        </template>
        <el-menu-item v-for="c in item.children" :key="c.path" :index="c.path">
          <span class="item-text">{{ c.title }}</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item v-else :index="item.path">
        <span class="mini-ico">{{ abbr(item.title) }}</span>
        <span class="title-text">{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { getMenuTree } from '@/utils/menu'

export default {
  name: 'Sidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    menu() {
      return getMenuTree()
    },
    activePath() {
      return this.$route.path
    },
  },
  methods: {
    abbr(title) {
      const s = String(title || '').trim()
      if (!s) return '•'
      return s.slice(0, 1).toUpperCase()
    },
  },
}
</script>

<style scoped>
.menu {
  border-right: none;
  height: calc(100vh - var(--app-header-height));
  padding-top: 6px;
}

.mini-ico {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 800;
  font-size: 12px;
  flex: 0 0 auto;
  margin-right: 8px;
}

.title-text,
.item-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

