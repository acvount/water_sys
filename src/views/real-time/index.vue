<template>
  <div class="real-time-view" v-loading="loading">
    <div class="search-top">
      <div style="display:inline-block;margin-right:10px;">
        <v-distpicker
          size="small"
          :province="siteForm.province"
          :city="siteForm.city"
          :area="siteForm.area"
          @province="onChangeProvince"
          @city="onChangeCity"
          @area="onChangeArea"
        ></v-distpicker>
      </div>
      <div style="display:inline-block;margin-right:10px;">
        <el-select
          size="small"
          style="width:100%;"
          clearable
          v-model="siteForm.tag"
          @change="tagSelect()"
          placeholder="请选择行业"
        >
          <el-option v-for="(item,index) in tag" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </div>
      <div style="display:inline-block;margin-right:10px;">
        <el-select size="small" style="width:100%" v-model="siteId" placeholder="请选择站点">
          <el-option
            v-for="(item,index) in siteOption"
            :key="index"
            :label="item.siteName"
            :value="item.siteName"
          ></el-option>
        </el-select>
      </div>
      <div style="display:inline-block;margin-right:10px;">
        <el-button size="small" type="primary" @click="msgSendBtnHandler()">发送短信</el-button>
      </div>
    </div>
    <el-row style="border:0px red solid;margin:10px 0px;" :gutter="20">
      <el-col :span="5">
        <div class="img_wap">
          <div class="site-name">
            <span style="font-weight:bold;color:red;">站点名称：</span>
            <span style="color:red;font-weight:bold">{{siteObj.siteName}}</span>
          </div>
          <img :src="siteObj.sitePicPath" draggable="false" />
        </div>
      </el-col>
      <el-col :span="19">
        <div style="border:0px blue solid; padding-bottom:14%;width: 100%;position: relative;">
          <div id="siteMap" style="width:100%;height:100%;position: absolute;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row style="border:0px #ccc solid;overflow: hidden;" class="real-time-chart" :gutter="20">
      <el-scrollbar style="height:100%">
        <el-col :span="24">
          <div style="display:flex;">
            <div class="chart-item" v-for="(item,index) in list3" :key="index">
              <div style="text-align:center;font-weight:bold;">{{getDevice(item.type)}}</div>
              <hr />
              <line-chart
                :height="'300px'"
                :deviceName="item.name"
                :title="getDevice(item.type)"
                :chartData="getLineRealData(item.name)"
              ></line-chart>
              <div class="data-chart-label">推送时间：{{item.lastPushTime}}</div>
              <div>
                <span class="data-chart-label" style="margin-right:10px;">设备名称：{{item.name}}</span>
                <span class="data-chart-label" style="margin-right:10px;">id：{{item.id}}</span>
                <span class="data-chart-label" style="margin-right:10px;">
                  状态：
                  <span v-if="item.eStatus =='正常'" class="e-color-success">{{item.eStatus}}</span>
                  <span v-else class="e-color-error">{{item.eStatus}}</span>
                </span>
              </div>
              <div class="data-chart-label">
                当前数据状态：
                <span v-if="item.dataStatus == 1" class="e-color-success">正常</span>
                <span v-else class="e-color-error">异常</span>
                <!-- <el-button
                  style="margin-left:10px;"
                  type="text"
                  v-if="item.hasAbnormalData"
                  @click="QueryErrorrRcord(item.name)"
                >查看异常记录({{item.hasAbnormalData}})</el-button>-->
                <el-link
                  type="danger"
                  style="margin-left:10px;"
                  v-if="item.hasAbnormalData"
                  @click="QueryErrorrRcord(item.name)"
                >查看异常记录({{item.hasAbnormalData}})</el-link>
              </div>
              <div class="data-chart-label">数据统计</div>
              <bar-chart
                :height="'300px'"
                :title="getDevice(item.type)"
                :chartData="getBarMonthData(item.name)"
              ></bar-chart>
              <div v-for="(element,index) in list1" :key="index">
                <div
                  v-if="element.name==item.name"
                  class="data-chart-label"
                >年度总量：{{element.yearCountData.toFixed(2)}}</div>
                <div
                  v-if="element.name==item.name"
                  class="data-chart-label"
                >年度平均值：{{element.yearAvgData.toFixed(2)}}</div>
                <div
                  v-if="element.name==item.name"
                  class="data-chart-label"
                >年度最大值：{{element.yearMaxValue}}</div>
                <div
                  v-if="element.name==item.name"
                  class="data-chart-label"
                >年度最小值：{{element.yearMinValue}}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-scrollbar>
    </el-row>

    <el-dialog title="短信告知" :visible.sync="msgDigVisible" width="40%" :close-on-click-modal="false">
      <div style="display: flex;justify-content: space-between;margin:10px 0;">
        <el-select
          style="width:48%;"
          size="small"
          v-model="deviceVal"
          collapse-tags
          multiple
          placeholder="请选择设备"
        >
          <el-option
            v-for="(item,index) in DeviceOption"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select style="width:48%;" size="small" v-model="deviceUserVal" placeholder="选择发送人">
          <el-option
            v-for="(item,index) in DeviceUserOption"
            :key="index"
            :label="`${item.name}-${item.phone}`"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <el-input style="height:50px" placeholder="请填写设备状态" v-model="deviceStatus"></el-input>
      <div style="margin:5px 0;">模版内容:</div>
      <div>
        位于【
        <span class="color-red">{{siteId}}</span>】的【
        <span class="color-red">{{converBadDevice(deviceVal,DeviceOption)}}</span>】设备情况为【
        <span class="color-red">{{deviceStatus}}</span>】，请至现场排查。
      </div>
      <span v-if="siteId == ''" class="color-red">请先选择一个站点</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="msgDigVisible = false">取 消</el-button>
        <el-button type="primary" @click="msgHandlerOK()">发 送</el-button>
      </span>
    </el-dialog>

    <el-dialog title="异常记录" :visible.sync="errorRecordsVisible" width="50%">
      <el-button @click="readHandler('','all')">全部已读</el-button>
      <el-button @click="delHandler('','all')">删除全部</el-button>
      <el-table :data="errRecodeData.data" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="设备"></el-table-column>
        <el-table-column prop="value" label="值"></el-table-column>
        <el-table-column label="规则">
          <template slot-scope="scope">{{scope.row.v1 == 0 ?'大于':'小于'}}</template>
        </el-table-column>
        <el-table-column prop="v" label="阈值"></el-table-column>
        <el-table-column label="违反时间" width="180">
          <template slot-scope="scope">{{formatTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="scope.row.isRead == 0"
              @click="readHandler(scope.row,'one')"
            >已读</el-button>
            <el-button type="text" size="small" disabled v-else>已读</el-button>
            <el-button type="text" size="small" @click="delHandler(scope.row,'one')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="errorRecordForm.pageNo"
        :page-sizes="[5,10, 20, 50, 100]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="errRecodeData.total"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorRecordsVisible = false">取 消</el-button>
        <el-button type="primary" @click="errorRecordsVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import BarChart from "@/components/Echarts/realBar";
import LineChart from "@/components/Echarts/realLine";
import { device } from "@/utils/data-utils.js";
export default {
  data() {
    return {
      loading: false,
      siteForm: {
        province: "",
        city: "",
        area: "",
        tag: ""
      },
      siteId: "",
      siteObj: {
        siteName: ""
      },
      tag: [],
      siteOption: [], //站点下拉
      map: "", //地图对象
      list1: [], //统计值
      list2: [], //柱状图值
      list3: [], //设备值
      realData: [],
      msgDigVisible: false, //发送短信弹框
      DeviceOption: [],
      DeviceUserOption: [],
      deviceVal: "",
      deviceUserVal: "",
      deviceStatus: "",
      errorRecordsVisible: false,
      errorRecordForm: {
        eName: "",
        pageSize: 5,
        pageNo: 0
      },
      errRecodeData: {
        data: [],
        total: 0
      } //异常记录
    };
  },
  components: { VDistpicker, BarChart, LineChart },
  mounted() {
    this.$websocket.dispatch("WEBSOCKET_INIT");
    this.initTag();
    this.initMap();
    this.getSite();
  },
  beforeDestroy() {
    this.$websocket.dispatch("WEBSOCKET_DESTROY");
  },
  computed: {
    formatTime() {
      return function(time) {
        return this.moment(time - 8 * 3600 * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      };
    },
    getDevice() {
      return function(val) {
        return device(val);
      };
    },
    getLineRealData() {
      return function(deviceName) {
        let data = this.realData.filter(item => {
          return item.name == deviceName;
        });
        let charJson = { xData: [], yData: [] };
        data.forEach(element => {
          charJson.xData.push(
            element.lastPushTime.substr(5, element.lastPushTime.length)
          );
          charJson.yData.push(element.value);
        });
        return charJson;
      };
    },
    getBarMonthData() {
      return function(deviceName) {
        let data = this.list2.filter(item => {
          return item.name == deviceName;
        });
        let charJson = { xData: [], yData: [] };
        data.forEach(element => {
          charJson.xData.push(element.strTime);
          charJson.yData.push(element.value.toFixed(2));
        });
        return charJson;
      };
    },
    converName() {
      //页面展示显示的名字
      return function(val, option, type) {
        let arr = [];
        arr = option.filter(item => {
          return item.id == val;
        });
        if (arr.length != 0) {
          return arr[0][type];
        }
      };
    },
    converBadDevice() {
      return function(val, option) {
        let arr = "";
        option.forEach(item => {
          val.forEach(element => {
            if (item.id == element) {
              arr += item.name + "、";
            }
          });
        });
        return arr != "" ? arr.substring(0, arr.length - 1) : "";
      };
    }
  },
  methods: {
    readHandler(row, type) {
      if (type == "all") {
        this.$confirm("确定要将所有异常记录改为已读", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(res => {
          this.readOK(row, type);
        });
      } else {
        this.readOK(row, type);
      }
    },
    delHandler(row = null, type) {
      if (type == "all") {
        this.$confirm("确定要删除所有异常记录", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(res => {
          this.delOK(row, type);
        });
      } else {
        this.delOK(row, type);
      }
    },
    readOK(row, type) {
      let api = type == "one" ? this.api.real.readOne : this.api.real.readAll;
      let param =
        type == "one" ? { id: row.id } : { eName: this.errorRecordForm.eName };
      this.$request.post(api, param).then(res => {
        if (res.code == 1) {
          this.$message.success("操作成功");
          this.QueryErrorData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    delOK(row, type) {
      let api = type == "one" ? this.api.real.delOne : this.api.real.delAll;
      let param =
        type == "one" ? { id: row.id } : { eName: this.errorRecordForm.eName };
      this.$request.post(api, param).then(res => {
        if (res.code == 1) {
          this.$message.success("操作成功");
          this.QueryErrorData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSizeChange(val) {
      //弹窗分页
      this.errorRecordForm.pageSize = val;
      this.QueryErrorData();
    },
    handleCurrentChange(val) {
      //弹窗分页
      this.errorRecordForm.pageNo = val;
      this.QueryErrorData();
    },
    QueryErrorrRcord(name) {
      //点击查询异常记录
      //查看异常记录
      this.errorRecordForm.eName = name;
      this.errorRecordsVisible = true;
      this.QueryErrorData();
    },
    QueryErrorData() {
      //查询异常记录
      this.$request
        .post(this.api.real.getErrorRecord, this.errorRecordForm)
        .then(res => {
          if (res.code == 1) {
            this.errRecodeData.data = res.data.list;
            this.errRecodeData.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    msgHandlerOK() {
      if (
        this.deviceUserVal == "" ||
        this.deviceVal == "" ||
        this.deviceStatus == ""
      ) {
        this.$message.warning("请检查设备，联系人，设备状态是否填写完毕");
        return;
        ``;
      }
      //发送短信
      this.$confirm("确定要发送该短信，发送后该操作不可逆", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "发送",
        cancelButtonText: "取消"
      })
        .then(res => {
          this.$request
            .post(this.api.real.sendMsg, {
              siteName: this.siteId,
              number: this.converName(
                this.deviceUserVal,
                this.DeviceUserOption,
                "phone"
              ),
              eName: this.converBadDevice(this.deviceVal, this.DeviceOption),
              status: this.deviceStatus
            })
            .then(res => {
              if (res.code == 1) {
                this.$message.success("短信发送成功");
              } else {
                this.$message.error("短信发送失败");
              }
              this.msgDigVisible = false;
            });
        })
        .catch(err => {});
    },
    msgSendBtnHandler() {
      //选择发送的人设备...
      let siteIdArr = this.siteOption.filter(item => {
        return item.siteName == this.siteId;
      });
      if (siteIdArr.length == 0) {
        this.$message.warning("请先选择一个站点");
        return;
      }
      this.initDevice(siteIdArr[0].id);
      this.initDeviceUser(siteIdArr[0].id);
      this.msgDigVisible = true;
    },
    initDevice(siteId) {
      //初始化发短信设备列表
      this.$request
        .post(this.api.sys.site.badEquipments, { siteId: siteId })
        .then(res => {
          if (res.code == 1) {
            this.DeviceOption = res.data;
            this.deviceVal = [];
            res.data.forEach(element => {
              this.deviceVal.push(element.id);
            });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    initDeviceUser(siteId) {
      //初始化设备维护人员
      this.$request
        .post(this.api.real.getAllUser, { siteId: siteId })
        .then(res => {
          if (res.code == 1) {
            this.DeviceUserOption = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    initMap() {
      var _this = this;
      this.map = new BMap.Map("siteMap", { enableMapClick: false });
      var map = this.map;
      var myStyleJson = [
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: {
            visibility: "off"
          }
        }
      ];
      map.setMapStyle({ styleJson: myStyleJson });
      var myGeo = new BMap.Geocoder();
      var point = new BMap.Point(113.920409, 32.547603);
      this.map.centerAndZoom(point, 14);
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      map.disableDragging(); //禁止拖拽
      // map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      // map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
    },
    onChangeProvince(val) {
      this.siteForm.province = val.value;
      this.getSite();
    },
    onChangeCity(val) {
      this.siteForm.city = val.value;
      this.getSite();
    },
    onChangeArea(val) {
      this.siteForm.area = val.value;
      this.getSite();
    },
    tagSelect() {
      this.getSite();
    },
    initTag() {
      //行业
      this.$request.post(this.api.sys.site.getTag).then(res => {
        if (res.code == 1) {
          this.tag = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getSite() {
      if (this.siteForm.area == "") {
        this.siteForm.area = "区";
      }
      if (this.siteForm.city == "") {
        this.siteForm.city = "市";
      }
      if (this.siteForm.province == "") {
        this.siteForm.province = "省";
      }
      this.$request
        .post(this.api.real.getSiteByCity, this.siteForm)
        .then(res => {
          if (res.code == 1) {
            this.siteOption = res.data;
            if (res.data.length != 0) {
              if (this.$route.query.siteId) {
                //从地图页面跳来
                this.siteId = this.$route.query.siteId;
              }
            }
          } else {
            this.$message.error("站点查询异常");
          }
        });
    },
    getSiteHistory(item) {
      this.loading = true;
      this.siteObj = item;
      var point = new BMap.Point(item.longitude, item.latitude);
      this.map.centerAndZoom(point, 14);
      var marker = new BMap.Marker(point);
      this.map.clearOverlays();
      this.map.addOverlay(marker);
      this.$request
        .post(this.api.real.charsHistiry, { siteId: item.id })
        .then(res => {
          if (res.code == 1) {
            if (res.data.list3.length == 0) {
              this.$message.info("该站点暂时没有绑定设备");
            } else {
              this.list2 = res.data.list2;
              this.list3 = res.data.list3;
              this.$websocket.getters.STAFF_UPDATE.send(
                `{"action":"RealQuery","message":{"currentSite":"${item.id}"}}`
              );
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      this.$request
        .post(this.api.real.getHistory, { siteId: item.id })
        .then(res => {
          if (res.code == 1) {
            this.list1 = res.data.list1;
          }
        });
      this.$websocket.getters.STAFF_UPDATE.onmessage = e => {
        let data = JSON.parse(e.data);
        data.forEach(item => {
          console.log(
            `${this.moment(new Date().getTime()).format(
              "YYYY-MM-DD HH:mm:ss"
            )}->${item.name}:${item.value}->设备状态：${
              item.eStatus
            }->数据状态：${item.dataStatus}->是否有异常记录->${
              item.hasAbnormalData
            }`
          );

          if (this.realData.length / this.list3.length >= 20) {
            this.realData.shift();
          }
          if (item.eStatus == "正常") {
            this.realData.push(item);
          }
          this.list3.forEach((element, index) => {
            if (item.name == element.name) {
              if (item.eStatus != element.eStatus) {
                this.list3[index].eStatus = item.eStatus;
              }
              if (item.dataStatus != element.dataStatus) {
                this.list3[index].dataStatus = item.dataStatus;
              }
              if (item.lastPushTime != element.lastPushTime) {
                this.list3[index].lastPushTime = item.lastPushTime;
              }
              if (item.hasAbnormalData != element.hasAbnormalData) {
                this.list3[index].hasAbnormalData = item.hasAbnormalData;
              }
            }
          });
        });
      };
    }
  },
  watch: {
    siteId(newval, oldval) {
      this.siteOption.filter(item => {
        if (item.siteName == newval) {
          this.getSiteHistory(item);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.real-time-view {
  padding: 20px;

  .search-top {
    display: flex;
  }
  .distpicker-address-wrapper select {
    height: 32px;
    font-size: 13.3333px;
  }
}
.BMap_cpyCtrl {
  // display: none;
}
.anchorBL {
  // display: none;
}
.real-time-chart {
  .el-col {
    margin-bottom: 10px;
  }
  .chart-item {
    width: 400px;
    min-width: 400px;
    margin-right: 10px;
    min-height: 500px;
    border-radius: 4px;
    border: 1px #ccc solid;
    display: inline-block;
    & > div,
    & > h5 {
      margin: 10px;
      font-weight: bold;
    }
  }
}
.img_wap {
  padding-bottom: 56%;
  width: 100%;
  position: relative;
  .site-name {
    position: absolute;
    top: 0;
    left: 0;
    font-weight: bold;
    font-family: "微软雅黑";
    z-index: 300;
  }
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.data-chart-label {
  font-size: 15px;
  font-weight: bold;
  color: #000;
}

.e-color-success {
  color: #2ecc71;
}
.e-color-error {
  color: #c0392b;
}
.color-red {
  color: red;
}
.msg-show {
  height: 50px;
  margin: 10px 0;
}
</style>