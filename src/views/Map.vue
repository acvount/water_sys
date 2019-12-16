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
      <!-- 详细列表 -->
      <div class="wa_site_details_list" ref="wa_site_details_list">
        <alarm-top :Info="Info"></alarm-top>
        <el-scrollbar style="height:360px;">
          <el-search-table-pagination
            :formOptions="table_forms"
            type="local"
            border
            :data="table_data"
            :columns="table_columns"
          ></el-search-table-pagination>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>


<script>
import alarmTop from "@/components/alarmTop.vue";
export default {
  data() {
    return {
      map: null,
      myGeo: null,
      marker: [],
      siteName: "",
      Info: {
        title: "实时事件",
        export: false
      },
      table_forms: {
        inline: true,
        size: "small",
        initParams: { queryKey: "" },
        forms: []
      },
      table_data: [
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        {
          name: "shebei1",
          a: "100,200"
        },
        { id: "2", level: "2", name: "34", remark: "" }
      ],
      table_columns: [
        { prop: "name", label: "设备名称", minWidth: 10 },
        { prop: "a", label: "经纬度", minWidth: 30 }
      ]
    };
  },
  components: { alarmTop },
  mounted() {
    this.initData();
    this.map = new BMap.Map("map", { enableMapClick: false });
    var point = new BMap.Point(116.404, 39.915);
    this.myGeo = new BMap.Geocoder();
    this.map.centerAndZoom(point, 15);
    this.map.enableScrollWheelZoom();
    // setTimeout(() => {
    //   this.searchMap();
    // }, 5000);
  },
  watch: {
    map() {
      this.initMap();
    }
  },
  methods: {
    initData() {
      this.$request.post(this.api.map.getAll).then(res => {
        if (res.code == 1) {
          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initMap() {
      var bounds = this.map.getBounds();
      var sw = bounds.getSouthWest();
      var ne = bounds.getNorthEast();
      var lngSpan = Math.abs(sw.lng - ne.lng);
      var latSpan = Math.abs(ne.lat - sw.lat);
      const state = ["success", "warning", "error"];
      for (var i = 0; i < 20; i++) {
        var myIcon = new BMap.Icon(
          `static/images/${
            state[Math.floor(Math.random() * state.length)]
          }.png`,
          new BMap.Size(16, 26)
        );
        let point = new BMap.Point(
          // 116.3964115512547,
          // 39.915697954752716
          sw.lng + lngSpan * (Math.random() * 0.7),
          ne.lat - latSpan * (Math.random() * 0.7)
        );
        this.initMapLabel(i, point, myIcon);
      }
    },
    initMapLabel(i, point, myIcon) {
      var marker = new BMap.Marker(point, { icon: myIcon });
      // this.marker.push(marker);
      var label = new BMap.Label(i);
      label.setStyle({
        display: "none"
      });
      marker.setLabel(label);
      this.map.addOverlay(marker); //添加到地图上
      this.addClickHandler(marker);
    },
    addClickHandler(marker) {
      let _this = this;
      marker.addEventListener("click", function() {
        let mapContent = `
          <div class='mapInfo'>
            <span>设备名称</span>
            <div>机器状态：断电</div>
            <div>设备1：shebei1</div>
            <div>设备1：shebei1</div>
          </div>
        `;
        var infoBox = new BMapLib.InfoBox(_this.map, mapContent);
        infoBox.open(marker);
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
      // var allOverlay = this.map.getOverlays();
      // for (var i = 0; i < allOverlay.length; i++) {
      //   // console.log(allOverlay[i].getLabel());
      //   if (allOverlay[i].getLabel().content == this.siteName || 1 == 1) {
      //     //==>
      //     var myIcon = new BMap.Icon(
      //       `static/images/success.png`,
      //       new BMap.Size(16, 26)
      //     );
      //     // var marker = new BMap.Marker(allOverlay[i].point, { icon: myIcon });
      //     // var label = new BMap.Label(this.siteName);
      //     // label.setStyle({
      //     //   // display: "none"
      //     // });
      //     // marker.setLabel(label);
      //     // this.map.addOverlay(marker); //添加到地图上
      //     // this.addClickHandler(marker);
      //     // this.marker.push(marker);
      //     //==>
      //     this.initMapLabel(
      //       allOverlay[i].getLabel().content,
      //       allOverlay[i].point,
      //       myIcon
      //     );
      //     setTimeout(() => {
      //       this.map.removeOverlay(allOverlay[i]);
      //     }, 200);
      //     // return false;
      //   }
      // }
      // return;
      this.myGeo.getPoint(
        this.siteName,
        point => {
          this.map.centerAndZoom(point, 8);
        },
        "全国"
      );
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
    height: 400px;
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
  overflow: hidden;
}
.el-scrollbar__wrap {
  // overflow-x: hidden;
  // overflow-y: auto;
}

.mapInfo {
  min-width: 200px;
  height: auto;
  overflow: hidden;
  background: #ccc;
  padding: 10px;
}
</style>