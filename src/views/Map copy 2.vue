<template>
  <div class="wa-map">
    <div class="search-top">
      <el-col :span="5">
        <el-input
          placeholder="请输入站点名称"
          suffix-icon="el-icon-search"
          size="mini"
          v-model="siteName"
          v-on:click.native="getMapPoint($event)"
          @keyup.enter.native="Enter()"
        ></el-input>
      </el-col>
    </div>
    <div class="gis">
      <div id="map"></div>
    </div>
  </div>
</template>


<script>
import alarmTop from "@/components/alarmTop.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      map: null,
      myGeo: null,
      marker: [],
      siteArr: [], //初次展示站点
      siteName: ""
    };
  },
  components: { alarmTop },
  mounted() {
    this.initWebSocket();
    this.initMap();
    this.initMapStatus();
  },
  beforeDestroy() {
    this.$websocket.dispatch("WEBSOCKET_DESTROY");
  },
  watch: {
    // siteArr() {
    //   this.initMap();
    // }
  },
  computed: {
    ...mapGetters({ socket: "STAFF_UPDATE" })
  },
  methods: {
    initWebSocket() {
      //初始化websocket
      this.$websocket.dispatch("WEBSOCKET_INIT");
      this.$websocket.getters.STAFF_UPDATE.onmessage = e => {
        let msg = JSON.parse(e.data);
        if (msg.message == "successConnection") {
          this.$websocket.getters.STAFF_UPDATE.send(
            `{"action":"MapQuery","message":""}`
          );
        } else {
          console.log(msg);
          this.editSiteStatus(msg);
        }
      };
    },
    editSiteStatus(dataJson) {
      //更改站点状态
      let allOverlay = this.map.getOverlays();
      console.log(allOverlay)
      return;
      allOverlay.forEach((item, index) => {
        dataJson.forEach(element => {
          console.log(item.getLabel())
          if (item.getLabel().content == element.siteId) {
            // this.map.removeOverlay(allOverlay[index]);
            var myIcon = new BMap.Icon(
              `static/images/success.png`,
              new BMap.Size(16, 26)
            );
            var point = new BMap.Point(element.longitude, element.latitude);
            var marker = new BMap.Marker(point, {
              icon: myIcon
            });
            var label = new BMap.Label(element.siteId);
            // label.setStyle({
            //   display: "none"
            // });
            marker.setLabel(label);
            this.map.addOverlay(marker); //添加到地图上
            let _this = this;
            // marker.addEventListener("click", function(e) {
            //   var p = e.target;
            //   var point = new BMap.Point(
            //     p.getPosition().lng,
            //     p.getPosition().lat
            //   );
            //   var infoWindow = new BMap.InfoWindow(item, siteName, {
            //     width: 250, // 信息窗口宽度
            //     height: 80, // 信息窗口高度
            //     title: item.siteName, // 信息窗口标题
            //     enableMessage: true //设置允许信息窗发送短息
            //   });
            //   _this.map.openInfoWindow(infoWindow, point);
            // });

            // setTimeout(() => {
            //   this.map.removeOverlay(allOverlay[index]);
            // }, 1000);
          }
        });
      });
    },
    initMap() {
      //初始化地图
      this.map = new BMap.Map("map", { enableMapClick: false });
      var point = new BMap.Point(116.404, 39.915);
      this.myGeo = new BMap.Geocoder();
      this.map.centerAndZoom("河南省信阳市", 10);
      this.map.enableScrollWheelZoom();
    },
    initMapStatus() {
      this.$request.post(this.api.map.getAll).then(res => {
        if (res.code == 1) {
          this.siteArr = res.data;
          this.siteArr.forEach((item, index) => {
            var myIcon = new BMap.Icon(
              `static/images/success.png`,
              new BMap.Size(16, 26)
            );
            let point = new BMap.Point(item.longitude, item.latitude);
            this.initMapLabel(item, point);
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initMapLabel(item, point, myIcon) {
      //鼠标悬浮
      var marker = new BMap.Marker(point, { icon: myIcon });
      var label = new BMap.Label(item.id);
      // label.setStyle({
      //   display: "none"
      // });
      marker.setLabel(label);
      this.map.addOverlay(marker); //添加到地图上
      // this.addClickHandler(marker);
      let _this = this;
      marker.addEventListener("click", function(e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow("xxxx", {
          width: 250, // 信息窗口宽度
          height: 80, // 信息窗口高度
          title: item.siteName, // 信息窗口标题
          enableMessage: true //设置允许信息窗发送短息
        });
        _this.map.openInfoWindow(infoWindow, point);
      });
    },
    addClickHandler(marker) {
      //点击事件
      let _this = this;
      marker.addEventListener("click", function(e) {
        // let mapContent = `
        //   <div class='mapInfo'>
        //     <span>设备名称</span>
        //     <div>机器状态：断电</div>
        //     <div>设备1：shebei1</div>
        //     <div>设备1：shebei1</div>
        //   </div>
        // `;
        // var infoBox = new BMapLib.InfoBox(_this.map, mapContent);
        // infoBox.open(marker);
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow("xxxx", {
          width: 250, // 信息窗口宽度
          height: 80, // 信息窗口高度
          title: "信息窗口", // 信息窗口标题
          enableMessage: true //设置允许信息窗发送短息
        });
        _this.map.openInfoWindow(infoWindow, point);
      });
    },
    Enter() {
      this.searchMap();
    },
    getMapPoint(event) {
      if (event.target.tagName == "I") {
        this.searchMap();
      }
    },
    searchMap() {
      this.map.centerAndZoom(this.siteName, 14);
    },
    closeAlarm: function() {
      this.$refs.wa_site_details_list.style.bottom = "-400px";
    }
  }
};
</script>

<style lang="scss">
.wa-map {
  overflow: hidden;
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
  .gis {
    width: 100%;
    position: relative;
    height: calc(100% - 40px);
  }
  .wa_site_details_list {
    width: 100%;
    height: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: all 0.2s linear;
    background: #f9f9f9;
    border-bottom: 1px solid red;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
}
#map {
  width: 100%;
  position: relative;
  height: calc(100vh - 161px);
}
#app .app-content .app-wrap .content-wrap {
  // overflow: hidden;
}
.el-scrollbar__wrap {
  // overflow-x: hidden;
  // overflow-y: auto;
}

.mapInfo {
  min-width: 200px;
  height: auto;
  // overflow: hidden;
  background: #ccc;
  padding: 10px;
}
</style>