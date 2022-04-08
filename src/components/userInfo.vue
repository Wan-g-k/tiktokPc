<template>
     <a-layout-sider width='400'>
         <Tabs></Tabs>
     </a-layout-sider>
</template>

<script>
import Tabs from './tabs/index.vue'
export default {
    name:'UserInfo',
    components:{ Tabs },
    data(){
        return {
            
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep  .a-layout-sider {
    /* color: #333; */
    display: flex;
    width: 300px !important;
    /* border-radius: 5px; */
    /* margin: 5px; */
    background: #e9e9e9;
    flex-direction: column;
    /* border:1px solid #c0c4cc */
}

</style>