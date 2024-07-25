<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
  import { useAppStore } from '@/store/app'
  const config = reactive({ max: 3 })
  const i18n = useI18n()
  const locale = computed(() => {
    const store = useAppStore()
    i18n.locale.value = store.getLanguage
    return {
      name: i18n.locale.value,
      el: i18n.messages.value[i18n.locale.value].el
    }
  })
</script>

<style>
*,
::before,
::after {
  padding: 0;
  margin: 0;
  box-sizing: inherit;
}
</style>
