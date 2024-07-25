<template>
  <el-dialog v-bind="$attrs" v-model="dialogVisible" :close-on-click-modal="false" :align-center="true">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script setup>
  const dialogVisible = ref(false)
  const open = () => (dialogVisible.value = true)
  const close = () => (dialogVisible.value = false)

  defineExpose({ close, open })
</script>

<style lang="scss" scoped>
  // :deep(.el-dialog) {
  //   display: flex;
  //   flex-direction: column;
  //   max-height: 90vh;
  //   margin: 0 !important;
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
</style>
