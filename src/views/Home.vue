<template>
  <div>首页</div>
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