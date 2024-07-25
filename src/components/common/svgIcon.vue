<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup>
import { defineComponent, computed } from 'vue'

const props = defineProps({
  // 使用的svg图标名称，也就是svg文件名
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: 'icon'
  }
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scope>
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentcolor;
  }
</style>
