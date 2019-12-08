<template>
  <div class="wa-map">
    <div class="search-top">
      <el-col :span="5">
        <el-input
          placeholder="请输入站点名称"
          suffix-icon="el-icon-search"
          size="mini"
          v-on:click.native="getMapPoint($event)"
          @keyup.enter.native="Enter()"
        ></el-input>
      </el-col>
    </div>
    <div id="map"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {};
  },
  mounted() {
    var map = new BMap.Map("map", { enableMapClick: false });
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom();
  },
  methods: {
    Enter() {
      console.log(123);
    },
    getMapPoint(event) {
      if (event.target.tagName == "I") {
        console.log(1);
      }
    }
  }
};
</script>

<style lang="scss">
.wa-map {
  .search-top {
    height: 40px;
    box-shadow: border;
    background: #f9f9f9;
    border-bottom: 1px solid #d2d2d2;
    padding: 0 15px;
    color: #333;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    align-items: center;
  }
}
#map {
  width: 100%;
  position: relative;
  height: calc(100vh - 161px);
}
</style>