<template>
  <div class="wa-home-view">
    <!-- <el-row :gutter="24" class="count-to">
      <el-col :span="5">
        <div class="bg-cart">
          <div class="left-icon red">
            <i class="iconfont icon-zhandian red"></i>
          </div>
          <div>
            <h2>站点总量</h2>
            <countTo class="num" :startVal="0" :endVal="endVal" :duration="3600"></countTo>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="bg-cart">
          <div class="left-icon blue">
            <i class="iconfont icon-geishuishebei blue"></i>
          </div>
          <div>
            <h2>正常站点</h2>
            <countTo class="num" :startVal="0" :endVal="endVal" :duration="3600"></countTo>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="bg-cart">
          <div class="left-icon purple">
            <i class="iconfont icon-geishuishebei purple"></i>
          </div>
          <div>
            <h2>月费用</h2>
            <countTo class="num" :startVal="0" :endVal="endVal" :duration="3600"></countTo>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="bg-cart">
          <div class="left-icon green">
            <i class="iconfont icon-geishuishebei green"></i>
          </div>
          <div>
            <h2>年费用</h2>
            <countTo class="num" :startVal="0" :endVal="endVal" :duration="3600"></countTo>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <div id="HomeCharts" style="width:100%;height:calc(100vh - 290px);"></div>
    </div>-->
    欢迎登陆水资源管理系统 
    <!-- 亦客测试管理系统-->
  </div>
</template>


<script>
import countTo from "vue-count-to";
import echarts from "echarts";
export default {
  data() {
    return {
      endVal: 1000
    };
  },
  components: { countTo },
  mounted() {
    // this.initLine();
  },
  methods: {
    initLine() {
      let myChart = echarts.init(document.getElementById("HomeCharts"));
      let option = {
        title: {
          text: "月流量",
          left: "center"
        },
        xAxis: {
          data: [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00",
            "24:00",
            "25:00",
            "26:00",
            "27:00",
            "28:00",
            "29:00",
            "30:00",
            "31:00",
            "32:00"
          ],
          boundaryGap: false
        },
        grid: {
          left: 20,
          right: 40,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#81ecec",
                lineStyle: {
                  color: "#81ecec",
                  width: 2
                },
                areaStyle: {
                  color: "#f3f8ff"
                }
              }
            },
            animationDuration: 2800,
            data: [5, 20, 36, 10, 10, 20]
          },
          {
            name: "效率",
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#6c5ce7",
                lineStyle: {
                  color: "#6c5ce7",
                  width: 2
                },
                areaStyle: {
                  color: "#f3f8ff"
                }
              }
            },
            animationDuration: 2800,
            data: [1, 5, 10, 17, 10, 20]
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss">
.content-wrap {
  overflow: hidden;
}
.wa-home-view {
  padding: 10px;
  font-size: 30px;
  position: relative;
  top: 50%;
  text-align: center;
  background-image: linear-gradient(-90deg, #3393ba 0%, #3894b9 100%);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 10px;
  .count-to {
    margin: 20px;
    & .bg-cart {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 0 0 5px #ccc;
      border-color: rgba(0, 0, 0, 0.05);
      & > div:first-child {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
        i.iconfont {
          font-size: 48px;
          &.red {
            color: red;
          }
          &.blue {
            color: #1e90ff;
          }
          &.purple {
            color: #546de5;
          }
          &.green {
            color: #2bcbba;
          }
        }
      }
      &:hover .left-icon {
        &.red {
          background: #fc5c65;
        }
        &.blue {
          background: #1e90ff;
        }
        &.purple {
          background: #546de5;
        }
        &.green {
          background: #2bcbba;
        }
        i {
          color: #fff !important;
        }
      }
      &:hover div:first-child {
        background: blue;
      }
      & > div:last-child {
        float: right;
        margin-right: 50px;
        & .num {
          font-size: 20px;
        }
      }
    }
  }
}
</style>