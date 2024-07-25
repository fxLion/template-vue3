<template>
  <div class="title">{{ $t('aside.' + router.currentRoute.value.name) }}</div>
</template>

<script setup>
  const router = useRouter()
</script>

<style lang="scss" scoped>
  .title {
    font-size: 20px;
    color: #4d4e50;
    margin-bottom: 18px;
  }
</style>
