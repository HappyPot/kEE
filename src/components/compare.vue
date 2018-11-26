<template>
  <div class="compare" v-cloak>
    <div class="compareHead">
      <p>医生对比</p>
      <div class="compareGrounds">
        <div class="compareItem blue" @click="compareDetail()">
          <div class="comparePos">
            <img src="../assets/listHead.png" alt="">
            <span>叶定伟</span>
          </div>
        </div>
        <div class="compareItem yellow" @click="compareDetail()">
          <div class="comparePos">
            <img src="../assets/listHead.png" alt="">
            <span>叶定伟</span>
          </div>
        </div>
        <div class="compareItem red" @click="compareDetail()">
          <div class="comparePos">
            <img src="../assets/listHead.png" alt="">
            <span>叶定伟</span>
          </div>
        </div>
      </div>
    </div>
    <div class="compareChart">
      <div id="myCharts" style="width: 100%;height:400px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "compare",
  data() {
    return {
      hospitalArray: [1, 2, 4],
      number: "",
      select: ""
    };
  },
  mounted() {
    this.select = this.hospitalArray[0];
    this.drawCharts();
    // ajax
  },
  methods: {
    compareDetail() {},
    drawCharts() {
      //自适应窗口大小
      setTimeout(() => {
        let container = document.getElementById("myCharts");
        container.style.width = window.innerWidth * 1 + "px";
        container.style.height = window.innerHeight * 0.65 + "px";
        let myChart = this.$echarts.init(document.getElementById("myCharts"));
        let option = {
          //  蓝 黄 红      //黄95b872 蓝83995e 红a82a58
          color: ["#ec5d91", "#d0df57", "#98a8e9"],
          tooltip: {
            trigger: "axis"
          },
          legend: {
            right: 10,
            orient: "vertical",
            data: [
              {
                name: "江泽飞", //蓝色
                icon: "circle"
              },
              {
                name: "叶定伟", //黄色
                icon: "circle"
              },
              {
                name: "周立群", //粉色
                icon: "circle"
              }
            ]
          },
          radar: [
            {
              nameGap: 9,
              // name: {
              //   // formatter: function(value, indicator) {
              //   //   return "value";
              //   // }
              // },
              indicator: [
                { text: "学术影响力", color: "#000", max: 100 },
                { text: "对AZ  \n认可度", color: "#000", max: 100 },
                { text: "对于医保   \n决策影响力", color: "#000", max: 100 },
                { text: "对于CFDA\n的影响力", color: "#000", max: 100 },
                { text: "科研能力", color: "#000", max: 100 }
              ],
              center: ["50%", "40%"],
              radius: "65%"
            }
          ],
          series: [
            {
              type: "radar",
              data: [
                {
                  name: "周立群", //粉红色
                  value: [90, 10, 52, 40, 69],
                  symbol: "roundRect",
                  areaStyle: {
                    color: "#ec5d91",
                    opacity: 0.5
                  },
                  lineStyle: {
                    color: "#ec5d91"
                  },
                  itemStyle: {
                    borderColor: "#ec5d91",
                    color: "#ec5d91"
                  }
                },
                {
                  name: "江泽飞", //蓝色
                  value: [80, 30, 50, 20, 60],
                  symbol: "roundRect",
                  symbolSize: 3,
                  areaStyle: {
                    color: "#98a8e9",
                    opacity: 0.5
                  },
                  lineStyle: {
                    color: "#98a8e9"
                  },
                  itemStyle: {
                    borderColor: "#8399e5",
                    color: "#8399e5"
                  }
                },
                {
                  name: "叶定伟", //黄色
                  value: [10, 20, 80, 90, 50],
                  symbol: "roundRect",
                  symbolSize: 3,
                  areaStyle: {
                    color: "#d0df57",
                    opacity: 0.5
                  },
                  lineStyle: {
                    color: "#d0df57"
                  },
                  itemStyle: {
                    borderColor: "#d0df57",
                    color: "#d0df57"
                  }
                }
              ]
            }
          ]
        };
        myChart.setOption(option);
      }, 0);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped type="text/css">
.blueActive {
  box-shadow: 0px 0.03rem 0.38rem 0px rgba(220, 220, 220, 0.5),
    0px 0.02rem 0.13rem 0px rgba(116, 128, 237, 0.5);
}
.yellowActive {
  box-shadow: 0px 0.03rem 0.38rem 0px rgba(220, 220, 220, 0.5),
    0px 0.02rem 0.13rem 0px rgba(208, 223, 87, 0.5);
}
.redActive {
  box-shadow: 0px 0.03rem 0.38rem 0px rgba(220, 220, 220, 0.5),
    0px 0.02rem 0.13rem 0px rgba(236, 93, 145, 0.5);
}
.blue {
  box-shadow: 0px 0.03rem 0.38rem 0px rgba(220, 220, 220, 0.5);
  margin-left: 0.4rem;
}
.blue::after {
  content: "";
  display: block;
  position: relative;
  width: 100%;
  height: 0.12rem;
  border-radius: 0.14rem;
  border-bottom: 0.2rem solid #8fa0e9;
  top: 2.2rem;
}
.yellow {
  box-shadow: 0px 0.03rem 0.38rem 0px rgba(220, 220, 220, 0.5);
}
.yellow::after {
  content: "";
  display: block;
  position: relative;
  width: 100%;
  height: 0.12rem;
  border-radius: 0.14rem;
  border-bottom: 0.2rem solid #d0df57;
  top: 2.2rem;
}
.red {
  box-shadow: 0px 0.03rem 0.38rem 0px rgba(220, 220, 220, 0.5);
}
.red::after {
  content: "";
  display: block;
  position: relative;
  width: 100%;
  height: 0.12rem;
  border-radius: 0.14rem;
  border-bottom: 0.2rem solid #ec5d91;
  top: 2.2rem;
}
.compareHead p {
  padding: 0;
  margin: 0;
  font-family: PingFangSC-Medium;
  font-size: 0.4rem;
  color: #222222;
  padding-left: 0.31rem;
  padding-top: 0.38rem;
}
.compareGrounds {
  display: flex;
  margin-top: 0.4rem;
}
.compareItem {
  width: 2rem;
  height: 2.5rem;
  // flex: 1;
  box-sizing: border-box;
  border-radius: .14rem;
  position: relative;
  margin-right: 0.33rem;
}
.compareItem img {
  width: 1.14rem;
  height: 1.14rem;
  display: block;
  margin: 0 auto;
}
.compareItem span {
  display: block;
  font-family: PingFangSC-Regular;
  font-size: 0.31rem;
  color: #333333;
  text-align: center;
  margin-top: 0.28rem;
}
.comparePos {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.compareChart {
  background: #ffffff;
  width: 100%;
  margin-top: 0.9rem;
}
.compare {
  background: #ffffff;
  overflow: hidden;
  height: 100%;
}
</style>
