<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") == -1) {
      this.$notify({
        title: "提示",
        message: "为了良好的兼容性，请使用Chrome游览器",
        type: "warning",
        duration: 7000
      });
    }
  }
};
</script>

<style >
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: "Microsoft Yahei", "宋体", "Helvetica Neue", "Helvetica",
    "Hiragino Sans GB", "WenQuanYi Micro Hei", "sans-serif";
  font-size: 16px;
  height: 100%;
  overflow: hidden;
  color: #666;
}
div {
  font-size: 16px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
}
.el-message {
  top: 40px !important;
}
</style>