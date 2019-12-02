<template>
  <div class="wa-home-view">欢迎登陆水资源管理系统</div>
</template>


<script>
export default {
  data() {
    return {};
  },
  mounted() {
    if (this.$socket.readyState === 1) {
      this.$socket.send(JSON.stringify({ router: "home" }));
    }
    this.$socket.onmessage = data => console.log(data);
  }
};
</script>

<style lang="scss">
.wa-home-view {
  font-size: 30px;
  position: relative;
  top: 50%;
  text-align: center;
  background-image: linear-gradient(-90deg, #3393ba 0%, #3894b9 100%);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 10px;
}
</style>