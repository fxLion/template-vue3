<template>
  <div class="l7-base-form-container">
    <el-form ref="elFormRef" v-bind="$attrs">
      <slot></slot>
    </el-form>
  </div>
</template>

<script setup>
  import { onMounted, ref, unref, nextTick } from 'vue'

  const props = defineProps({
    langRootKey: {
      type: String,
      default: ''
    }
  })

  const elFormRef = ref(null)
  const validate = callback => {
    unref(elFormRef).validate(valid => {
      if (!valid) {
        nextTick(() => {
          let isError = document.getElementsByClassName('is-error')
          isError[0].scrollIntoView({
            // 滚动到指定节点
            // 值有 start，center，end，nearest，当前显示在视图区域中间
            block: 'center',
            // 值有 （auto、instant、smooth），缓动动画（当前是慢速的）
            behavior: 'smooth'
          })
        })
      }
      callback(valid)
    })
  }
  const validateField = field => {
    unref(elFormRef).validateField(field)
  }
  const clearValidate = () => {
    unref(elFormRef).clearValidate()
  }
  const resetFields = () => {
    unref(elFormRef).resetFields()
  }

  defineExpose({ validate, validateField, clearValidate, resetFields })
</script>
