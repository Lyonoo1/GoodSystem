<template>
  <div class="page">
    <el-card>
      <div class="h1">仪表盘</div>
      <div class="sub">这是一个可扩展的管理后台骨架：左侧一级/二级菜单、顶部用户信息、路由守卫与示例页面。</div>
    </el-card>

    <div class="grid">
      <el-card class="stat">
        <div class="k">今日访问</div>
        <div class="v">12,480</div>
      </el-card>
      <el-card class="stat">
        <div class="k">待处理</div>
        <div class="v">23</div>
      </el-card>
      <el-card class="stat">
        <div class="k">告警</div>
        <div class="v warn">2</div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.h1 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}
.sub {
  color: #86909c;
  font-size: 13px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.stat .k {
  color: #86909c;
  font-size: 12px;
}
.stat .v {
  font-size: 26px;
  font-weight: 800;
  margin-top: 6px;
}
.warn {
  color: #f53f3f;
}
</style>

