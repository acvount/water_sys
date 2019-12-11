<template>
  <div class="wa-day-view" ref="waDayView">
    <div class="switch-chart">
      <el-switch
        v-model="switchS"
        :active-value="false"
        :inactive-value="true"
        active-text="图表展示"
        inactive-text="表格展示"
      />
    </div>
    <template v-if="switchS">
      <el-form :inline="true" class="serch-form">
        <el-form-item label="站点编号">
          <el-input v-model="searchForm.siteNo" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="站点名称">
          <el-input v-model="searchForm.siteName" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="searchForm.sensor" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select size="mini" clearable v-model="searchForm.sensorStatus">
            <el-option label="正常" value="1"></el-option>
            <el-option label="异常" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数据状态">
          <el-select size="mini" clearable>
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="searchForm.dayTime"
            value-format="yyyy-MM-dd"
            type="date"
            size="mini"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="选择时间段">
          <el-time-picker
            style="width:200px;"
            is-range
            size="mini"
            v-model="Times"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="QueryHandle()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
        <el-table-column align="center" label="站点编号" prop="siteNo"></el-table-column>
        <el-table-column align="center" label="站点名称" prop="siteName"></el-table-column>
        <el-table-column align="center" label="设备编号" prop="ename"></el-table-column>
        <el-table-column align="center" label="设备状态"></el-table-column>
        <el-table-column align="center" label="数据状态" prop="dateAvg"></el-table-column>
        <el-table-column align="center" label="当日总量" prop="countDate"></el-table-column>
        <el-table-column align="center" label="最后采集时间" width="160" prop="lastPushTime"></el-table-column>
        <el-table-column align="center" label="操作" width="160">
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
    </template>
    <div v-if="!switchS" id="DayCharts" ref="DayCharts" style="height:calc(100vh - 270px);"></div>

    <el-dialog
      title="数据推送详情"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div style="display:flex;justify-content: flex-end;">
        <el-switch v-model="detaialSwitch" inactive-color="#ccc"></el-switch>
      </div>
      <el-table v-if="detaialSwitch" :data="detaialData" height="300">
        <el-table-column align="center" prop="sname" label="设备一" width="150"></el-table-column>
        <el-table-column align="center" prop="svalue" label="当时流速"></el-table-column>
        <el-table-column align="center" prop="hname" label="设备二" width="200"></el-table-column>
        <el-table-column align="center" prop="hvalue" label="水位高度"></el-table-column>
      </el-table>
      <component v-else :is="'line-chart'" :chart-data="detaialData" />
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
import { mapGetters } from "vuex";
export default {
  components: {
    LineChart
  },
  data() {
    return {
      detaialSwitch: false,
      dialogVisible: false,
      switchS: true,
      loading: false,
      myChart: null,
      tableData: [],
      detaialData: [],
      Times: null,
      searchForm: {
        dayTime: new Date(),
        pageNo: 0,
        pageSize: 10,
        siteNo: "",
        siteName: "",
        sensor: "",
        beginTime: "",
        endTime: ""
      }
    };
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    thiss.removeChart();
  },
  methods: {
    detaial(row) {
      this.$request
        .post(this.api.history.details, {
          eName: row.ename,
          beginTime: this.searchForm.beginTime,
          endTime: this.searchForm.endTime
        })
        .then(res => {
          if (res.code == 1) {
            this.detaialSwitch = false;
            this.detaialData = res.data;
            this.dialogVisible = true;
          }
        });
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.initData();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val;
      this.initData();
    },
    QueryHandle() {
      if (this.searchForm.dayTime == null) {
        this.searchForm.dayTime = "";
      }
      if (this.searchForm.dayTime == "" && this.Times == null) {
        this.searchForm.beginTime = "";
        this.searchForm.endTime = "";
      } else if (this.searchForm.dayTime != "" && this.Times != null) {
        this.searchForm.beginTime = `${this.searchForm.dayTime} ${
          this.Times[0]
        }`;
        this.searchForm.endTime = `${this.searchForm.dayTime} ${this.Times[1]}`;
      } else if (this.searchForm.dayTime != "" && this.Times == null) {
        this.searchForm.beginTime = `${this.searchForm.dayTime} 00:00:00`;
        this.searchForm.endTime = `${this.searchForm.dayTime} 23:59:59`;
      } else if (this.searchForm.dayTime == "" && this.Times != null) {
        this.$message.warning("请选择日期");
        return false;
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
          this.loading = false;
        } else {
          this.$message.err(res.msg);
        }
      });
    },
    initCharts() {
      // DayCharts.style.width = this.$refs.waDayView.offsetWidth - 30 + "px";
      this.myChart = echarts.init(this.$refs.DayCharts);
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
    ...mapGetters({ IS_COLLAPSE: "IS_COLLAPSE" })
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
</style>