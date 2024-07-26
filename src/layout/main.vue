<script setup>
  const route = useRoute()
  const key = computed(() => {
    return route.path
  })
</script>

<template>
    <div>
      <router-view v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component" :key="key" />
        </Transition>
      </router-view>
    </div>
  </template>

  
  <style lang="scss">
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .1s ease;
    }
  
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  </style>
  