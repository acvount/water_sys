<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {}
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