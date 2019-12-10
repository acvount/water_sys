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
          <el-button type="primary" size="mini" @click="initData()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" :loading="loading">
        <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
        <el-table-column align="center" label="站点编号" prop="siteNo"></el-table-column>
        <el-table-column align="center" label="站点名称" prop="siteName"></el-table-column>
        <el-table-column align="center" label="设备编号" prop="ename"></el-table-column>
        <el-table-column align="center" label="设备状态"></el-table-column>
        <el-table-column align="center" label="数据状态" prop="dateAvg"></el-table-column>
        <el-table-column align="center" label="当日总量" prop="countDate"></el-table-column>
        <el-table-column align="center" label="最后采集时间" width="150" prop="lastPushTime"></el-table-column>
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
    <div v-show="!switchS" id="DayCharts" style="width:100%;height:calc(100vh - 270px);"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      switchS: true,
      loading: false,
      myChart: null,
      tableData: [],
      Times: null,
      searchForm: {
        dayTime: "",
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
    // this.$nextTick(() => {
    //   this.initCharts();
    // });
  },
  methods: {
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.initData();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val;
      this.initData();
    },
    initData() {
      this.loading = true;
      // if (this.Times != null && this.searchForm.dayTime != "") {
      //   this.searchForm.beginTime =
      //     this.searchForm.dayTime + " " + this.Times[0];
      //   this.searchForm.endTime = this.searchForm.dayTime + " " + this.Times[1];
      // } else {
      //   if (this.searchForm.dayTime != "") {
      //     this.searchForm.beginTime = `${this.searchForm.dayTime} 00:00:00`;
      //     this.searchForm.endTime = `${this.searchForm.dayTime} 23:59:59`;
      //   }
      // }
      if (
        this.searchForm.dayTime != "" &&
        this.searchForm.dayTime != null &&
        this.Times != null
      ) {
        this.searchForm.beginTime =
          this.searchForm.dayTime + " " + this.Times[0];
        this.searchForm.endTime = this.searchForm.dayTime + " " + this.Times[1];
      } else if (this.searchForm.dayTime != "" && this.Times == null) {
        this.searchForm.beginTime = `${this.searchForm.dayTime} 00:00:00`;
        this.searchForm.endTime = `${this.searchForm.dayTime} 23:59:59`;
      } else if (this.Times != null && this.searchForm.dayTime == "") {
        this.$message.warning("请选择日期");
        return;
      }
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
      let DayCharts = document.getElementById("DayCharts");
      DayCharts.style.width = this.$refs.waDayView.offsetWidth - 30 + "px";
      this.myChart = echarts.init(DayCharts);
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
      this.myChart.on("click", function(param) {
        var name = param.name;
        console.log(name);
      });
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    }
  },
  watch: {
    switchS(val) {
      if (!val) {
        this.initCharts();
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