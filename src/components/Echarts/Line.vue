<template>
  <div :style="'height:' + height + '; width: ' + width                         " />
</template>

<script>
import echarts from "echarts";

export default {
  name: "ChartLine",
  props: {
    height: {
      type: String,
      default: "300px"
    },
    width: {
      type: String,
      default: "100%"
    },
    chartData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 图表位置
    gridTop: {
      type: String,
      default: "25%"
    },
    gridLeft: {
      type: String,
      default: "3%"
    },
    gridRight: {
      type: String,
      default: "5%"
    },
    gridBottom: {
      type: String,
      default: "13%"
    },
    // 标题
    title: {
      type: String,
      default: ""
    },
    titleFSize: {
      type: Number,
      default: 16
    },
    // 单位
    xUnit: {
      type: String,
      default: ""
    },
    yUnit: {
      type: String,
      default: ""
    },
    // 图标的位置
    legendOrient: {
      type: String,
      default: "horizontal"
    },
    legendX: {
      type: String,
      default: "center"
    },
    legendY: {
      type: String,
      default: "bottom"
    },
    // 功能列表显示
    toolboxShow: {
      type: Boolean,
      default: true
    },
    // 最值显示
    markPoint: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null // Echarts实例
    };
  },
  mounted() {
    this.init();
    this.initData();
  },
  methods: {
    // 初始化
    init() {
      this.chart = echarts.init(this.$el);
      // 监听页面大小改变
      window.addEventListener("resize", () => {
        if (this.chart) {
          this.chart.resize();
        }
      });
    },
    // 初始化数据
    initData() {
      if (!this.chartData) return;
      const obj = JSON.parse(JSON.stringify(this.chartData));
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
      this.chart.setOption(option);
      obj.forEach(element => {});
    },
    // 注销echarts
    removeChart(type) {
      if (!this.chart) {
        return;
      }
      this.chart.dispose(); // 销毁echarts
      this.chart = null;
      if (type === "reset") {
        this.init();
      }
    }
  },
  watch: {
    // 监听到数据改变，重新加载echarts数据
    chartData(val) {
      this.removeChart("reset");
      this.initData();
    }
  }
};
</script>