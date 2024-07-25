<template>
    <div class="loading" ref="loadingRef" v-loading="loading" :element-loading-text="$t('common.loading')">
    </div>
</template>

<script setup>

    let loading = ref(false)

    const loadingSwitch = (status) => {
        loading.value = status
    }

    defineExpose({loadingSwitch})

    onMounted(() => {
        loading.value = true
    })

    onUnmounted(() => {
        loading.value = false
    })
</script>

<style scoped lang="scss">
.loading {
    height: 300px;
    margin: 18px 30px;
    background-color: #ffffff;
}
</style>