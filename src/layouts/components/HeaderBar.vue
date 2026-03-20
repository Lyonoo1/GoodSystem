<template>
  <div class="header-right">
    <el-dropdown trigger="click" @command="onCommand">
      <div class="user">
        <div class="avatar">{{ avatarText }}</div>
        <div class="meta">
          <div class="name">{{ userName }}</div>
          <div class="role">{{ userRole }}</div>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HeaderBar',
  computed: {
    ...mapState('user', ['userInfo']),
    userName() {
      return this.userInfo?.name || 'Admin'
    },
    userRole() {
      return this.userInfo?.role || '—'
    },
    avatarText() {
      return (this.userName || 'A').slice(0, 1).toUpperCase()
    },
  },
  methods: {
    ...mapActions('user', ['logout']),
    async onCommand(cmd) {
      if (cmd === 'logout') {
        await this.logout()
        this.$router.replace({ path: '/login' })
      }
    },
  },
}
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  padding: 6px 10px;
  border-radius: 10px;
  transition: background 0.15s ease;
}
.user:hover {
  background: rgba(31, 35, 41, 0.04);
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1677ff 0%, #00c2ff 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 8px 16px rgba(22, 119, 255, 0.18);
}
.meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.name {
  font-size: 14px;
  color: #1f2329;
}
.role {
  font-size: 12px;
  color: #86909c;
}
</style>

