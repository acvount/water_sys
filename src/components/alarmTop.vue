<template>
  <div class="site-details-top">
    <div class="top-title">{{Info.title}}</div>
    <div class="alarm-checkbox">
      <el-checkbox label="全部" border size="mini">
        <span class="title">全部</span>
      </el-checkbox>
      <el-checkbox label="硬件异常" border size="mini">
        <i class="iconfont icon-state-site flag-icon error"></i>
        <span class="title">硬件异常</span>
      </el-checkbox>
      <el-checkbox label="数据异常" border size="mini">
        <i class="iconfont icon-state-site flag-icon warning"></i>
        <span class="title">数据异常</span>
      </el-checkbox>
      <el-checkbox label="正常" border size="mini">
        <i class="iconfont icon-state-site flag-icon success"></i>
        <span class="title">正常</span>
      </el-checkbox>
    </div>
    <div style="float:right;">
      <i
        class="el-icon-error"
        style="font-size:20px;color:#0096ba;cursor:pointer;"
        @click="closeAlarm"
      ></i>
    </div>
  </div>
</template>
<script>
export default {
  created() {},
  mounted() {},
  data() {
    return {};
  },
  methods: {
    closeAlarm: function() {
      this.$parent.closeAlarm();
    }
  },
  watch: {},
  props: ["Info"],
  components: {}
};
</script>


<style lang="scss">
.site-details-top {
  height: 40px;
  line-height: 40px;
  background: #f9f9f9;
  border-bottom: 1px solid #d2d2d2;
  padding: 0px 15px;
  color: #333;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  .top-title {
    font-size: 14px;
    margin-right: 10px;
  }
  .top-title,
  .alarm-checkbox {
    float: left;
    .el-checkbox {
      margin-right: 10px;
      &.is-bordered.is-checked {
        border-color: #0096ba;
      }
    }
    .el-checkbox.is-bordered.el-checkbox--mini {
      height: 26px;
    }
  }
  .flag-icon {
    font-size: 12px;
    margin-left: -8px;
    &.error {
      color: red;
    }
    &.success {
      color: #2ecc71;
    }
    &.warning {
      color: #f1c40f;
    }
  }
}
</style>