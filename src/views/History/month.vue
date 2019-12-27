<template>
  <div class="wa-day-view" ref="waDayView">
    <el-form :inline="true" class="serch-form">
      <el-form-item label="站点编号">
        <el-input v-model="searchForm.siteNo" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="站点名称">
        <el-input v-model="searchForm.siteName" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="设备编号">
        <el-input v-model="searchForm.eName" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="设备状态">
        <el-select size="mini" clearable v-model="searchForm.eStatus">
          <el-option label="正常" value="1"></el-option>
          <el-option label="异常" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据状态">
        <el-select size="mini" clearable v-model="searchForm.dataStatus">
          <el-option label="正常" value="1"></el-option>
          <el-option label="异常" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间段">
        <el-date-picker
          value-format="yyyy-MM"
          v-model="searchForm.dayTime"
          size="mini"
          style="width:200px"
          type="month"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="QueryHandle()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :span-method="objectSpanMethod"
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column align="center" label="#" type="index" width="100"></el-table-column>
      <el-table-column align="center" label="站点编号" prop="siteNo"></el-table-column>
      <el-table-column align="center" label="站点名称" prop="siteName"></el-table-column>
      <el-table-column align="center" label="设备编号">
        <template slot-scope="scope">{{scope.row.eName == null ? '-':scope.row.eName}}</template>
      </el-table-column>
      <el-table-column align="center" label="设备状态">
        <template slot-scope="scope">{{devicesConver(scope.row.lastPushTime)}}</template>
      </el-table-column>
      <el-table-column align="center" label="数据状态">
        <template
          slot-scope="scope"
        >{{scope.row.dataStatus == 0 ? '异常':(scope.row.dataStatus == null?"-":"正常")}}</template>
      </el-table-column>
      <el-table-column align="center" label="设备类型" prop="eType">
        <template slot-scope="scope">{{eTypeConver(scope.row.eType)}}</template>
      </el-table-column>
      <el-table-column align="center" label="平均值">
        <template slot-scope="scope">{{scope.row.dataAvg?scope.row.dataAvg.toFixed(2):'-'}}</template>
      </el-table-column>
      <el-table-column align="center" label="最后采集时间" prop="lastPushTime">
        <template slot-scope="scope">{{TimeConver(scope.row.lastPushTime)}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="detaial(scope.row)">单点查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNo"
      :page-sizes="[10, 20, 50,100]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
    ></el-pagination>
    <el-dialog
      :title="detaiaDiaTitle"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div style="display:flex;justify-content: flex-end;">
        <el-switch v-model="detaialSwitch" inactive-color="#ccc"></el-switch>
      </div>
      <el-table v-if="detaialSwitch" :data="detaialData" height="300">
        <el-table-column align="center" type="index" label="#" width="150"></el-table-column>
        <el-table-column align="center" prop="name" label="设备名称" width="150"></el-table-column>
        <el-table-column align="center" prop="value" label="设备值"></el-table-column>
        <el-table-column align="center" prop="strTime" label="推送时间"></el-table-column>
      </el-table>
      <component v-else :title="detaiaType" :is="'line-chart'" :chart-data="chartdetaialData" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import LineChart from "@/components/Echarts/Line";
import LinesCharts from "@/components/Echarts/historyLine";
import { mapGetters } from "vuex";
export default {
  components: {
    LineChart,
    LinesCharts
  },
  data() {
    return {
      detaialSwitch: false,
      dialogVisible: false,
      detaiaType: "", //图表上的显示类型
      detaiaDiaTitle: "", //弹框显示设备类型
      switchS: true,
      loading: false,
      myChart: null,
      tableData: [],
      spanArr: [],
      detaialData: [], //图表值
      chartdetaialData: { xData: [], yData: [] }, //图表值
      Times: null,
      searchForm: {
        dayTime: this.moment().format("YYYY-MM"),
        pageNo: 0,
        pageSize: 10,
        siteNo: "",
        siteName: "",
        eName: "",
        beginTime: "",
        endTime: "",
        dataStatus: "", //数据状态
        eStatus: "" //设备状态
      }
    };
  },
  mounted() {
    this.QueryHandle();
  },
  beforeDestroy() {
    this.removeChart();
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    detaial(row) {
      this.$request
        .post(this.api.history.details, {
          name: row.eName,
          beginTime: this.searchForm.beginTime,
          endTime: this.searchForm.endTime,
          type: "month"
        })
        .then(res => {
          if (res.code == 1) {
            this.detaialSwitch = false;
            this.detaialData = res.data;
            this.chartdetaialData.xData = [];
            this.chartdetaialData.yData = [];
            res.data.forEach(element => {
              this.chartdetaialData.xData.push(element.strTime);
              this.chartdetaialData.yData.push(element.value);
            });
            this.detaiaType = row.eType;
            if (row.eType == 1) {
              this.detaiaDiaTitle = `【${row.siteNo}】 水位高度`;
            } else if (row.eType == 2) {
              this.detaiaDiaTitle = `【${row.siteNo}】 当时流量`;
            }
            this.dialogVisible = true;
          }
        });
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.QueryHandle();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val;
      this.QueryHandle();
    },
    QueryHandle() {
      if (this.searchForm.dayTime != null || this.searchForm.dayTime != "") {
        this.searchForm.beginTime = `${this.searchForm.dayTime}-01 00:00:00`;
        this.searchForm.endTime = `${this.searchForm.dayTime}-31 23:59:59`;
      } else {
        this.searchForm.beginTime = ``;
        this.searchForm.endTime = "";
      }
      this.initData();
    },
    initData() {
      this.loading = true;
      this.$request.post(this.api.history.day, this.searchForm).then(res => {
        if (res.code == 1) {
          this.searchForm.pageNo = res.data.pageNum;
          this.searchForm.pageSize = res.data.pageSize;
          this.searchForm.total = res.data.total;
          this.tableData = res.data.list;
          this.spanArr = [];
          let contactDot = 0;
          this.tableData.forEach((item, index) => {
            if (index === 0) {
              this.spanArr.push(1);
            } else {
              if (item.siteName == this.tableData[index - 1].siteName) {
                this.spanArr[contactDot] += 1;
                this.spanArr.push(0);
              } else {
                contactDot = index;
                this.spanArr.push(1);
              }
            }
          });
          this.loading = false;
        } else {
          this.$message.err(res.msg);
        }
      });
    },
    initCharts() {
      // DayCharts.style.width = this.$refs.waDayView.offsetWidth - 30 + "px";
      this.myChart = echarts.init(this.$refs.DayCharts);
      let myChart1 = echarts.init(this.$refs.DayCharts1);
      let XData = [];
      let YData = [];
      this.tableData.forEach(item => {
        XData.push(item.siteName);
        YData.push(item.countDate);
      });

      let option = {
        xAxis: {
          type: "category",
          data: XData
        },
        grid: {
          left: 20,
          right: 40,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: YData,
            type: "bar"
          }
        ]
      };
      this.myChart.setOption(option);
      myChart1.setOption(option);
      // this.myChart.on("click", function(param) {
      //   var name = param.name;
      //   console.log(name);
      // });

      window.onresize = () => {
        if (this.myChart) {
          this.myChart.resize();
        }
      };
    },
    removeChart(type) {
      if (!this.myChart) {
        return;
      }
      this.myChart.dispose(); // 销毁echarts
      this.myChart = null;
      if (type === "reset") {
        this.initCharts();
      }
    }
  },

  computed: {
    ...mapGetters({ IS_COLLAPSE: "IS_COLLAPSE" }),
    TimeConver() {
      return function(time) {
        if (time == null) {
          return "-";
        }
        return this.moment(time)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss");
      };
    },
    devicesConver() {
      return function(time) {
        if (time == null) {
          return "-";
        }
        return new Date().getTime() - (time - 8 * 60 * 60 * 1000) >
          3 * 60 * 1000
          ? "异常"
          : "正常";
      };
    },
    eTypeConver() {
      return function(type) {
        switch (type) {
          case "1":
            return "水位高度";
            break;
          case "2":
            return "当时流量";
            break;
          case "0":
            return "未知";
            break;
          default:
            return "-";
            break;
        }
      };
    },
    valueConver() {
      return function(row) {
        switch (row.eType) {
          case "2":
            return row.waterHeight;
            break;
          case 1:
            return row.countDate;
            break;
          default:
            return "-";
            break;
        }
      };
    }
  },
  watch: {
    IS_COLLAPSE() {
      setTimeout(() => {
        if (this.myChart) {
          this.myChart.resize();
        }
      }, 300);
    },
    switchS(val) {
      if (!val) {
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    }
  }
};
</script>

<style lang="scss">
.wa-day-view {
  padding: 10px 20px;
  .switch-chart {
    text-align: right;
    margin-bottom: 10px;
  }
  .el-form-item {
    margin-bottom: 5px;
  }
}
body .el-table th.gutter {
  display: table-cell !important;
}
body .el-table colgroup.gutter {
  display: table-cell !important;
}
.el-table tbody tr:hover > td {
  background-color: #ffffff !important;
}
</style>