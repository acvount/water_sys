<template>
  <div>
    {{testData}}
    <hr />
    {{testData1}}
  </div>
</template>


<script>
export default {
  data() {
    return {
      testData: [],
      testData1: [],
      count: 0
    };
  },
  mounted() {
    // if (this.$socket.readyState === 1) {
    //   this.$socket.send(JSON.stringify({ router: "home" }));
    // }
    // this.$socket.onmessage = data => console.log(data);
    this.$websocket.getters.STAFF_UPDATE.onmessage = e => {
      let result = JSON.parse(e.data);
      if (result["shebei1"]) {
        this.testData.push(result);
      } else {
        this.testData1.push(result);
      }
      // json.name = "张三";
      // this.count++;
      // json.count = this.count;
    };
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