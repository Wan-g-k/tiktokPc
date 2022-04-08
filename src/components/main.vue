<template>
    <a-layout-content >
        <MessgeBox></MessgeBox>
        <SendMessge></SendMessge>
    </a-layout-content>
</template>

<script>

import bus from "../utils/brotherBus";
import MessgeBox from './messgeBox/index.vue'
import SendMessge from './sendMessge/index.vue'
export default {
    

    name:'mains',
    components:{
        MessgeBox,
        SendMessge
    },
    data(){
        return {
            
        }
    },
    mounted(){
      bus.$on("setScroll", (res) => {
            var that = this;
            // that.$forceUpdate();
      // that.$store.commit('formatting')
      // that.scroolSetBottom();
    })
    }
}
</script>

<style lang="scss" scoped>
::v-depp .a-layout-content{
    display: flex;
    flex-direction: column;
    background-color: #e9eef3;
    color: #333;
    padding: 0;
    .messge-box{
        flex: 70%;
    }
    .send-messge{
        flex: 30%;
    }
}
</style>