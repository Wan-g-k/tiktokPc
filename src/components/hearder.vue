<template>
    <el-header style="height: 40px">{{
        this.$store.state.userInfo.nickname
    }}</el-header>
</template>


<style lang="scss" scoped>
.el-header {
    background: #304156;
    line-height: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: 5px 5px 0 0;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    margin: 0 auto;
    color: white;
}
</style>