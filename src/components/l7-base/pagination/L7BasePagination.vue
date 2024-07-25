<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    layout="prev, pager, next, total, sizes"
    :total="pageTotal"
    :page-sizes="pageSizes"
    @current-change="handleCurrentPage"
    @size-change="handleSizeChange"
  ></el-pagination>
</template>

<script setup>
  const emit = defineEmits(['index-change', 'size-change'])
  const props = defineProps({
    pageTotal: { type: Number, default: 0 },
    pageData: Object
  })

  const pageSizes = [10, 25, 50, 100]

  // const pageSize = ref(props.pageData.pageSize)
  // const currentPage = ref(props.pageData.pageNum)

  const pageSize = toRef(props.pageData, 'pageSize')
  const currentPage = toRef(props.pageData, 'pageNum')

  const handleCurrentPage = index => {
    emit('index-change', index)
  }
  const handleSizeChange = () => {
    emit('size-change', unref(pageSize))
  }
</script>

<style lang="scss" scoped>
  .el-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 20px 0 10px;
  }
</style>
