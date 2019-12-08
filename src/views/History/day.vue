<template>
  <div class="wa-day-view">
     <div class="switch-chart">
      <el-switch
        v-model="switchS"
        width="46"
        active-value="0"
        inactive-value="1"
        active-text="图表展示"
        inactive-text="表格展示"
      />
    </div>
    <el-form :inline="true" class="serch-form">
      <el-form-item label="站点编号">
        <el-input size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="站点名称">
        <el-input size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="设备状态">
        <el-select size="mini" clearable>
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据状态">
        <el-select size="mini" clearable>
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker type="date" size="mini" style="width:200px"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-time-picker size="mini" style="width:200px"></el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="#" type="index" width="180"></el-table-column>
      <el-table-column label="站点编号"></el-table-column>
      <el-table-column label="站点名称"></el-table-column>
      <el-table-column label="设备编号"></el-table-column>
      <el-table-column label="设备状态"></el-table-column>
      <el-table-column label="数据状态"></el-table-column>
      <el-table-column label="当日总量"></el-table-column>
      <el-table-column label="采集时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      switchS: true
    };
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