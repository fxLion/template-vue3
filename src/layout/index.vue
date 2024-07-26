<script setup>
    import Header from './header.vue'
    import Aside from './aside.vue'
    import Main from './main.vue'
</script>

<template>
    <el-container>
        <el-header height="68px">
            <Header />
        </el-header>
        <el-container>
            <Aside />
            <el-main>
                <Main />
            </el-main>
        </el-container>
    </el-container>
</template>
  
<style lang="scss" scoped>
:deep(.el-header) {
    border: 1px solid #eaedfb;
    padding-left: 0px;
}

.el-main {
    height: calc(100vh - 68px);
    background-color: #f7f8fa;
    overflow: auto;
}
</style>
  