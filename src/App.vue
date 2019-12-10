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
  overflow: hidden;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
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
</style>