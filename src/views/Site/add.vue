<template>
  <div class="wa-site-add">
    <el-form
      label-width="80px"
      class="site-add-form"
      ref="siteForm"
      :rules="siteForm.rules"
      :model="siteForm.data"
    >
      <el-form-item label="站点名称" prop="siteName">
        <el-col :span="23">
          <el-input v-model="siteForm.data.siteName" size="small"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="站点编号" prop="siteNo">
        <el-col :span="23">
          <el-input v-model="siteForm.data.siteNo" size="small"></el-input>
        </el-col>
      </el-form-item> -->
      <el-form-item label="联系人" prop="contactNick">
        <el-col :span="23">
          <el-input v-model="siteForm.data.contactNick" size="small"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactDetail">
        <el-col :span="23">
          <el-input v-model="siteForm.data.contactDetail" size="small"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="设备厂商" prop="manufacturer">
        <el-col :span="23">
          <el-input v-model="siteForm.data.manufacturer" size="small"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="经纬度" prop="longitude">
        <el-col :span="23">
          <el-input v-model="MapPlace" size="small" :disabled="true" placeholder="当前位置经纬度"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="设备编号" prop="equipmentNo">
        <el-col :span="23">
          <el-input v-model="siteForm.data.equipmentNo" size="small"></el-input>
        </el-col>
      </el-form-item>-->
      <el-form-item label="站点地区" prop="address">
        <el-col :span="23">
          <el-cascader
            style="width:100%;"
            size="small"
            clearablex
            @change="cityChange"
            :options="options"
            v-model="addressArr"
          ></el-cascader>
        </el-col>
      </el-form-item>
      <el-form-item label="站点地址">
        <el-col :span="23">
          <el-input
            size="small"
            placeholder="详细地址"
            type="textarea"
            v-model="siteForm.data.siteAddress"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="传感器" size="small" prop="equipmentNo">
        <el-col :span="23">
          <el-select
            style="width:100%;"
            clearable
            v-model="siteForm.data.equipmentNo"
            placeholder="请选择传感器"
          >
            <el-option
              v-for="(item,index) in sensorList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()" :loading="loading">保存站点</el-button>
        <el-button size="small" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="wa-site-add-map">
      <el-input
        placeholder="输入地址搜索获取经纬坐标"
        size="small"
        v-model="searchVal"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" id="search"></el-button>
      </el-input>
      <div id="siteAddMap"></div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
export default {
  data() {
    return {
      loading: false,
      options: regionData,
      siteAddMap: "", //当前地图对象
      siteAddGeo: "", //根据位置找经纬度对象
      searchVal: "",
      addressArr: [],
      map: "", //地图对象
      siteForm: {
        data: {
          siteName: "", // 站点名称
          siteNo: "", //站点编号
          contactNick: "", //联系人
          contactDetail: "", //联系方式
          manufacturer: "", //设备厂商
          longitude: "", //经度
          latitude: "", //纬度
          equipmentNo: "", //设备编号
          siteAddress: "", //站点地址
          address: "" //地区三级
          // sensor: "" //传感器名称
        },
        rules: {
          siteName: [
            { required: true, message: "请输入站点名称", trigger: "blur" }
          ],
          siteNo: [
            { required: true, message: "请输入站点编号", trigger: "blur" }
          ],
          contactNick: [
            { required: true, message: "请输入联系人", trigger: "blur" }
          ],
          longitude: [
            { required: true, message: "请在地图上搜索地名", trigger: "change" }
          ],
          latitude: [
            { required: true, message: "请在地图上搜索地名", trigger: "change" }
          ],
          contactDetail: [
            { required: true, message: "请输入联系方式", trigger: "blur" }
          ],
          manufacturer: [
            { required: true, message: "请输入设备厂商", trigger: "blur" }
          ],
          equipmentNo: [
            { required: true, message: "请选择传感器名称", trigger: "blur" }
          ],
          address: [
            { required: true, message: "请选择地区", trigger: "change" }
          ]
        }
      }
    };
  },
  props: ["sensorList"],
  computed: {
    //经纬度
    MapPlace() {
      return `${this.siteForm.data.longitude},${this.siteForm.data.latitude}`;
    }
  },
  methods: {
    resetForm() {
      this.$refs["siteForm"].resetFields();
      this.siteForm.data.siteAddress = "";
      this.siteForm.data.longitude = "";
      this.siteForm.data.latitude = "";
      this.addressArr = [];
    },
    submitForm() {
      this.$refs["siteForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$request
            .post(this.api.sys.site.add, this.siteForm.data)
            .then(res => {
              if (res.code == 1) {
                this.$message.success("站点添加成功");
                this.resetForm();
              } else {
                this.$message.error(res.msg);
              }
              this.$emit("initEquipment");
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    cityChange(val) {
      this.siteForm.data.address = `${CodeToText[this.addressArr[0]]}/${
        CodeToText[this.addressArr[1]]
      }/${CodeToText[this.addressArr[2]]}`;
    },
 
    initMap() {
      var _this = this;
      this.map = new BMap.Map("siteAddMap", { enableMapClick: false });
      var map = this.map;
      var myGeo = new BMap.Geocoder();

      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 11);
      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用

      $("#search").on("click", function() {
        myGeo.getPoint(
          _this.searchVal,
          function(point) {
            map.centerAndZoom(point, 8);
            setPoint(point);
          },
          "全国"
        );
      });
      function setPoint(point) {
        if (point) {
          _this.siteForm.data.latitude = point.lat;
          _this.siteForm.data.longitude = point.lng;
          moveOverlay(point);
        }
      }
      function moveOverlay(point) {
        map.clearOverlays();
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.enableDragging(); //可以拖动
        //拖动监听点改变经纬度
        marker.addEventListener("dragend", function(e) {
          _this.siteForm.data.latitude = e.point.lat;
          _this.siteForm.data.longitude = e.point.lng;
        });
      }
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>

<style lang="scss">
.wa-site-add {
  display: flex;
  .site-add-form {
    width: 30%;
    box-sizing: border-box;
  }
  .wa-site-add-map {
    width: 70%;
    // height: 100%;
    border: 1px #ccc solid;
    position: relative;
    .input-with-select {
      position: absolute;
      z-index: 9;
      top: 10px;
      left: 10px;
      width: 300px;
    }
    #siteAddMap {
      width: 100%;
      height: 100%;
    }
  }
}
</style>