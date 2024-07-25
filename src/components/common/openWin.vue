<template>
  <el-icon :size="16" @click="openWin(buildURL(path, params))">
    <svg-icon name="jump"></svg-icon>
  </el-icon>
</template>

<script setup>
  import { buildURL, openWin } from '@/hook/common'

  const props = defineProps({
    path: {
      type: String,
      default: '/'
    },
    params: {
      type: Object,
      default: function () {
        return {}
      }
    }
  })
</script>
