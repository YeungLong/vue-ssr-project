<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: "app",
    beforeMount(){
      console.log("初始化路由")
    }
};
</script>

<style lang="less">
    @import './public/style/common.less';
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
        transform: rotate(0deg);
    }
</style>


