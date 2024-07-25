<template>
  <el-drawer ref="elDrawer" v-bind="$attrs" v-model="drawerVisible" :show-close="false">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
  </el-drawer>
</template>

<script setup>
  const drawerVisible = ref(false)
  const open = () => (drawerVisible.value = true)
  const close = () => (drawerVisible.value = false)

  defineExpose({ close, open })
</script>

<style lang="scss" scoped></style>
