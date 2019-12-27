<template>
  <div :style="'height:' + height + '; width: ' + width" />
</template>

<script>
import echarts from "echarts";

export default {
  name: "ChartBar",
  props: {
    height: {
      type: String,
      default: "calc(100vh - 450px)"
    },
    width: {
      type: String,
      default: "100%"
    },
    chartData: {
      type: Object
    },
    // 标题
    title: {
      type: String,
      default: ""
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
  computed: {},
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: obj.xData
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
            name: this.title,
            type: "bar",
            barWidth: "8%",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#16b9d2"
                  },
                  {
                    offset: 1,
                    color: "#b2dfe6"
                  }
                ]),
                barBorderRadius: 11
              }
            },
            data: obj.yData,
            type: "bar"
          }
        ]
      };

      this.chart.setOption(option);
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
    chartData: {
      handler() {
        // this.removeChart("reset");
        // this.initData();
      },
      deep: true
    }
  }
};
</script>