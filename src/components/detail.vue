<template>
  <div id="detail" v-cloak>
    <!-- 头像 -->
    <div class="detailHead">
      <img src="../assets/listHead.png" class="detailUserImg">
      <h4 v-if="doctorDetail.doctorName">{{doctorDetail.doctorName}}</h4>
      <h4 v-if="!doctorDetail.doctorName" style="display:block; height:1rem"></h4>
      <p>{{doctorDetail.hospital}}</p>
      <!-- <p>{{doctorDetail.hospital}}</p> -->
      <!-- <span>复旦肿瘤医院副院长 / CUA泌尿外科主委</span> -->
      <div class="detailTabs" v-if="dTitleList">
        <span
          v-for="(item,index) in dTitleList"
          :key="index"
          :class="tabIndex==index ? 'active':''"
          @click="clickTabs(index,item.type)"
        >{{item.name}}</span>
      </div>
    </div>
    <!-- 信息 -->
    <!-- <div class="detailBody" v-if="detailBodyList && !isCharts"> -->

    <!-- 基本信息 -->
    <div class="detailBody" v-show="isInfo">
      <div class="detailBodyItem" v-for="(item,index) in detailBodyList" :key="index">
        <div class="dbiTitle">{{item.title}}</div>
        <div class="dbiBody">
          <ul v-if="item.arr">
            <li v-for="(val,id) in item.arr" :key="id">{{val}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- AZ的合作-->
    <div class="detailBody" v-show="isAZ">
      <div class="detailBodyItem" v-for="(item,index) in azWork" :key="index">
        <div class="dbiTitle">{{item.title}}</div>
        <div class="dbiBody">
          <ul v-if="item.arr">
            <li v-for="(val,id) in item.arr" :key="id">{{val}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="detailBody" v-show="isCharts">
      <span class="i1">1</span>
      <span class="i2">2</span>
      <span class="i3">3</span>
      <span class="i4">4</span>
      <span class="i5">0</span>
      <div id="main" style="width: 100%;height:100%;"></div>
    </div>
  </div>
</template>

<script>
import config from "../until/config.js";
export default {
  name: "detail",
  data() {
    return {
      tabIndex: 0,
      isCharts: false,
      isAZ: false,
      isInfo: true,
      dTitleList: [
        {
          name: "基本信息",
          type: "msg",
          isClick: false
        },
        {
          name: "专家影响力",
          type: "force",
          isClick: false
        },
        {
          name: "与AZ的合作",
          type: "AZ",
          isClick: false
        }
      ],
      detailBodyList: [
        {
          title: "Title",
          arr: []
        },
        {
          title: "疾病领域",
          arr: []
        },
        {
          title: "Brand",
          arr: [] //    brandInfoList
        },
        {
          title: "专家需求",
          arr: [] //    expertsDemandInfoList
        }
      ],
      azWork: [
        {
          title: "BU",
          arr: []
        },
        {
          title: "CDU",
          arr: []
        },
        {
          title: "Medical",
          arr: []
        },
        {
          title: "Imed",
          arr: []
        }
      ],
      doctorDetail: {},
      resultData: [] // 接口数据
    };
  },
  mounted() {
    this.basicInfo();
  },

  methods: {
    //基本信息
    basicInfo(url) {
      let param = {
        doctorId: this.$route.params.id
      };
      console.log("paramdoctorId: ", param);
      this.requestData(config.getDoctorDetail, param, res => {
        console.log("res: ", res);
        this.resultData = res;
        this.doctorDetail["doctorName"] = res.doctorName;
        this.doctorDetail["hospital"] = res.hospital;
        this.detailBodyList.map(item => {
          if (item["title"] == "Title") {
            item.arr = res.titleInfoList;
          } else if (item["title"] == "疾病领域") {
            item.arr = res.diseaseAreaList;
          } else if (item["title"] == "Brand") {
            item.arr = res.brandInfoList;
          } else if (item["title"] == "专家需求") {
            item.arr = res.expertsDemandInfoList;
          }
        });
        this.azWork.map(item => {
          if (item["title"] == "BU") {
            item.arr = res.buInfoList;
          } else if (item["title"] == "CDU") {
            item.arr = res.cduInfoList;
          } else if (item["title"] == "Medical") {
            item.arr = res.medicalInfoList;
          } else if (item["title"] == "Imed") {
            item.arr = res.imedInfoList;
          }
        });
        console.log("this.detailBodyList: ", this.detailBodyList);
      });
    },
    // 与AZ的合作
    requestData(url, param, success, err) {
      this.$http.post(url, param).then(res => {
        if (res.data.code == "success") {
          success(res.data.data);
        } else {
          // err();
        }
      });
    },
    drawCharts() {
      //自适应窗口大小
      setTimeout(() => {
        let container = document.getElementById("main");
        container.style.width = window.innerWidth * 1 + "px";
        container.style.height = window.innerHeight * 0.588 + "px";
        let myChart = this.$echarts.init(document.getElementById("main"));
        let academicInfluence = this.resultData.academicInfluence - 0; //学术影响力
        let researchCapacity = this.resultData.researchCapacity - 0; //科研能力
        let cfdaInfluence = this.resultData.cfdaInfluence - 0; //对于CFDA的影响力
        let decisionInfluence = this.resultData.decisionInfluence - 0; //对于医保决策影响力
        let recognition = this.resultData.recognition - 0; //对于AZ的认可度
        let option = {
          tooltip: {
            // trigger: "axis"
          },
          radar: {
           
            nameGap: 9,
            splitNumber: 5,
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: ["#e1e1e1", "#cecece"],
              }
            },
            splitArea: {
              areaStyle: {
                color: "#fff"
              }
            },
            indicator: [
              {
                name: "学术影响力",
                color: "#000",
                min: 1,
                max: 5
              },
              { name: "科研能力", color: "#000", min: 1, max: 5 },
              { name: "对于CFDA\n的影响力", color: "#000", min: 1, max: 5 },
              { name: "对于医保\n决策影响力", color: "#000", min: 1, max: 5 },
              { name: "对于AZ\n认可度", color: "#000", min: 1, max: 5 }
            ],
            center: ["50%", "50%"],
            radius: "65%"
          },
          series: {
            type: "radar",
            itemStyle: {
              normal: {
                borderColor: "blue",
                lineStyle: {
                  color: "#7d95e6"
                },
                areaStyle: {
                  color: "#7d95e6",
                  opacity: 0.5
                }
              }
            },
           
            data: [
              {
                value: [
                  academicInfluence,
                  researchCapacity,
                  cfdaInfluence,
                  decisionInfluence,
                  recognition
                ],
                name: "数据"
              }
            ]
          }
        };
        myChart.setOption(option);
      }, 0);
    },
    domScroll() {
      let temp = setInterval(function() {
        if (document.body.scrollTop == 0) {
          clearInterval(temp);
        } else {
          document.body.scrollTop -= 20;
        }
      }, 10);
      console.log("a");
    },
    clickTabs(index, type) {
      console.log("type: ", type);
      this.tabIndex = index;
      this.domScroll();
      switch (type) {
        case "force":
          this.isCharts = true;
          this.isAZ = false;
          this.isInfo = false;
          this.drawCharts();
          break;
        case "msg":
          this.isCharts = false;
          this.isAZ = false;
          this.isInfo = true;
          //ajax
          break;
        case "AZ":
          this.isCharts = false;
          this.isAZ = true;
          this.isInfo = false;
          //ajax
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped type="text/css">
[v-cloak] {
  display: none;
}
.detailTabs {
  display: flex;
  font-family: PingFangSC-Regular;
  box-shadow: 0px 1px 0px 0px rgba(114, 114, 114, 0.5);
  box-sizing: border-box;
  span {
    display: block;
    font-size: 0.32rem;
    flex: 1;
    line-height: 0.84rem;
    color: #111111;
    text-align: center;
  }
  .active {
    border-bottom: 2px solid #6e84e5;
  }
}
.detailHead {
  width: 100%;
  color: #222222;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff;
  z-index: 1;
  h4 {
    font-family: PingFangSC-Medium;
    font-size: 0.36rem;
    margin-top: 0.3rem;
    margin-bottom: 0;
    color: #222222;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 0.28rem;
    margin-top: 0.23rem;
    margin-bottom: 0;
    color: #222222;
  }
  span {
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 0.26rem;
    color: #adb0b5;
    margin-top: 0.2rem;
  }
}
.detailTabs span {
  color: #111111;
}
.detailUserImg {
  display: block;
  width: 2.14rem;
  height: 2.14rem;
  background-color: #e9e9e3;
  box-shadow: 0px 0px 0.28rem 0px rgba(140, 140, 140, 0.24);
  border: solid 6px #ffffff;
  border-radius: 100%;
  margin: 0 auto;
  margin-top: 0.32rem;
}
// detailbody
.detailBody {
  background: #f7f7f7;
  padding-top: 5.2rem;
  padding-bottom: 0.3rem;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
}
.detailBodyItem {
  width: 6.84rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 0.22rem 0px rgba(208, 208, 208, 0.5);
  border-radius: 6px;
  margin: 0 auto;
  margin-top: 0.32rem;
  box-sizing: border-box;
  padding: 0.24rem 0.3rem;
  padding-bottom: 0.35rem;
}
.dbiTitle {
  font-family: PingFangSC-Regular;
  font-size: 0.32rem;
  color: #999999;
  border-bottom: solid 1px #e3e3e3;
  padding-bottom: 0.24rem;
}
.dbiBody {
  padding-top: 0.3rem;
}
.dbiBody ul {
  margin: 0;
  padding: 0;
}
.dbiBody ul li {
  list-style: none;
  color: #222222;
  font-family: PingFangSC-Regular;
  font-size: 0.3rem;
  display: block;
}
.detailBody {
  position: relative;
}
.detailBody span {
  position: absolute;
  font-size: 0.3rem;
  color: #666666;
}
.i1 {
  bottom: 4.33rem;
  left: 4.14rem;
  z-index: 1;
}
.i2 {
  bottom: 4.5rem;
  left: 4.6rem;
  z-index: 1;
}
.i3 {
  bottom: 4.65rem;
  left: 5.1rem;
  z-index: 1;
}
.i4 {
  bottom: 4.8rem;
  left: 5.5rem;
  z-index: 1;
}
.i5 {
  bottom: 4.03rem;
  left: 3.66rem;
  z-index: 1;
}
</style>
