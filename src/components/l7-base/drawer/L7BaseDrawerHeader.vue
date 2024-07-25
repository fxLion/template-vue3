<template>
  <header>
    <div class="left">
      <div class="close finger" @click="emit('close')">
        <el-icon><Close /></el-icon>
      </div>
      <div class="title">{{ props.title }}</div>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script setup>
  const emit = defineEmits(['close'])
  const props = defineProps({
    title: {
      type: String,
      default: ''
    }
  })
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    justify-content: space-between;
    padding: 17px 20px;
    background: #f7f8ff;
    border: 1px solid #e8ebfa;
    .left {
      display: flex;
      align-items: center;
      .close {
        margin-right: 12px;
      }
      .title {
        font-size: 18px;
        color: #303133;
      }
    }
  }
</style>
