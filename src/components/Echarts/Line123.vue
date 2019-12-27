<template>
  <div :style="'height:' + height + '; width: ' + width" />
</template>

<script>
import echarts from "echarts";

export default {
  name: "ChartLine",
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
  computed: {
    titleConver() {
      return function(type) {
        switch (type) {
          case "1":
            return "水位高度";
            break;
          case "2":
            return "流量";
            break;
        }
      };
    }
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
        xAxis: {
          data: obj.xData,
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
            name: this.titleConver(this.title),
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
            data: obj.yData
          }
        ]
      };
      // this.chart.setOption(option);
      let x = [];
      let y = [];
      let num = 0;
      this.$websocket.getters.STAFF_UPDATE.onmessage = e => {
        let json = JSON.parse(e.data);
        x.push(this.moment().format("MM-DD HH:mm:ss"));
        num++;
        y.push(json.shebei1);
        console.log(x.length)
        if (x.length >= 20) {
          x.shift(1);
          y.shift(1);
        }
        this.chart.setOption({
          xAxis: {
            data: x,
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
              name: this.titleConver(this.title),
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
              data: y
            }
          ]
        });
      };
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
