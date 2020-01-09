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
          this.editSiteStatus(msg);
        }
      };
    },
    editSiteStatus(dataJson) {
      //更改站点状态
      let allOverlay = this.map.getOverlays();
      allOverlay.forEach((item, index) => {
        dataJson.forEach(element => {
          if (item.siteId == element.siteId) {
            const state = ["success", "warning", "error"];
            let icon = 0;
            if (element.eStatus == "0") {
              icon = 2;
            } else if (element.hasAbnormalData > 0) {
              icon = 1;
            } else if (element.eStatus == "1") {
              icon = 0;
            }
            var myIcon = new BMap.Icon(
              `static/images/${state[icon]}.png`,
              new BMap.Size(50, 50)
            );
            item.setIcon(myIcon);
            item.setAnimation(BMAP_ANIMATION_BOUNCE);
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
              new BMap.Size(50, 50)
            );
            let point = new BMap.Point(item.longitude, item.latitude);
            this.initMapLabel(item, point, myIcon);
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initMapLabel(item, point, myIcon) {
      item = JSON.parse(JSON.stringify(item));
      //鼠标悬浮
      var marker = new BMap.Marker(point, { icon: myIcon });

      var label = new BMap.Label(item.id);
      label.setStyle({
        display: "none"
      });
      marker.setLabel(label);
      marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      this.map.addOverlay(marker); //添加到地图上
      let _this = this;
      marker.siteId = item.id;
      marker.siteName = item.siteName;
      marker.addEventListener("click", function(e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        _this.$request
          .post(_this.api.map.getDeviceList, {
            siteId: item.id
          })
          .then(res => {
            if (res.code == 1) {
              var sContent = `<h4 style='margin:0 0 5px 0;padding:0.2em 0'>${item.siteName}</h4>`;
              if (item.sitePicPath != "") {
                sContent += `
                 <div style="min-width:305px;"><img src="${item.sitePicPath}" width="200"  height='104' style="vertical-align: bottom;"/>
                 <button class="jump-shishi-btn" id="shishiBtn" >实时数据</button></div>
                `;
              }
              if (res.data.length != 0) {
                sContent += `<table border class="map-info-table" style="margin-top:5px;">
                  <tr>
                  <td>设备名</td>
                  <td>值</td>
                  <td style="width:37px;">类型</td>
                  <td>数据状态</td>
                  <td>最后推送时间</td>
                  </tr>
               `;
              }
              res.data.forEach(obj => {
                sContent += `<tr>
                  <td>${obj.name}</td>
                  <td>${
                    obj.lastPushValue == null ? "暂无数据" : obj.lastPushValue
                  }</td>
                  <td>${obj.TYPE}</td>
                  <td>${obj.dataStatus}</td>
                  <td>${obj.lastPushTime}</td>
                </tr>`;
              });
              if (res.data.length != 0) {
                sContent += " </table>";
              }
              var infoWindow = new BMap.InfoWindow(sContent);
              if (!infoWindow.isOpen()) {
                infoWindow.addEventListener("open", function(e) {
                  document.getElementById("shishiBtn").onclick = function() {
                    _this.$router.push({
                      path: "/real-time",
                      query: { siteId: item.siteName }
                    });
                  };
                });
              }
              _this.map.openInfoWindow(infoWindow, point);
            } else {
              _this.$message.error(res.msg);
            }
          });
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
      let allOverlay = this.map.getOverlays();
      allOverlay.forEach((item, index) => {
        console.log(item.siteName);
        if (item.siteName == this.siteName) {
          this.map.centerAndZoom(item.point, 14);
        }
      });
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
.map-info-table {
  padding: 2px;
  border-collapse: collapse;
  border-spacing: 0px 10px;
  td {
    text-align: center;
  }
}

.jump-shishi-btn {
  cursor: pointer;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>