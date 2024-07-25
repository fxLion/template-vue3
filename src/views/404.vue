<template>
  <div class="not-found">
    <img src="@/assets/img/404.png" alt="" srcset="" />
    <div class="back-home">
      <router-link to="/">{{ $t('common.backHome') }}</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
  .not-found {
    color: var(--el-color-primary);
    margin: calc(50vh - 220px) auto 0;
    text-align: center;
    .back-home {
      font-size: 18px;
      font-weight: 400;
      color: #525b65;
    }
    img {
      width: 600px;
    }
    @media (max-width: 800px) {
      img {
        width: 80%;
      }
    }
  }
</style>
