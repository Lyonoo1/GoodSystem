<template>
  <el-result icon="warning" title="页面不存在" sub-title="你访问的页面不存在或已被移动。">
    <template #extra>
      <el-button type="primary" @click="$router.replace('/')">回到首页</el-button>
    </template>
  </el-result>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

