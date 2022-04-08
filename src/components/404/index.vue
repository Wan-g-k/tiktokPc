<template>
    <div class="dummy">
        <p>欢迎您,用户：{{userNameData}}</p>
        <p>使用聊天工具</p>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    },
    computed:{
        userNameData(){
            return  sessionStorage.getItem('userName')
        }
    }
}
</script>

<style lang="scss" scoped>
    .dummy{
        flex: 1;
        left: 877px;
        position: absolute;
        top: 200PX;
        p{
            text-align: center;
            margin: 20px 0;
            font-size: 20px;
            font-size: 36px;
            /* background: linear-gradient(to right,#00dbde, #fc00ff); */
            background-clip: text;
            -o-background-clip: text;
            -ms-background-clip: text;
            -moz-background-clip: text;
            -webkit-background-clip: text;    
            color: black;
            opacity: 0.2;
            font-weight: 550;
        }
    }
</style>