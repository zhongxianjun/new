<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }
  html, body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  #app {
    .size;
  }
  .ivu-layout-sider {
    z-index: 99;
  }
  .ivu-card {
    background: #fff;
  }
  @keyframes opacity {
      0% { opacity: 0; }
      100% { opacity: 1; }
  }
  .ivu-card {
    background-color: #fff;
  }
</style>
