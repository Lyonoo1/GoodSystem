<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in crumbs" :key="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    crumbs() {
      return (this.$route.matched || [])
        .filter((m) => m.meta && m.meta.title)
        .map((m) => ({ path: m.path, title: m.meta.title }))
    },
  },
}
</script>

