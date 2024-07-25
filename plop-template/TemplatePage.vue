<template>
  <div class="main-container">
    <page-title></page-title>
    
    <l7-base-table ref="baseTableRef" reqUrl="" :params="params" :isOpsColumns="true" :isSearch="true" :isMore="false">
      <!-- 左部扩展区 -->
      <template #left>
        
      </template>
      <!-- 右部扩展区 -->
      <template #right>
        
      </template>

      <!-- 数据插槽 -->
      <!-- 操作列插槽 -->
    </l7-base-table>
  </div>
</template>

<script setup>
  import axios from '@/api/axios'
  import useI18nModule from '@/hook/useI18nModule'
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { i18nModule: i18M } = useI18nModule()
  const baseTableRef = ref(null)

  const params = reactive({})
</script>

<style lang="scss" scoped></style>
