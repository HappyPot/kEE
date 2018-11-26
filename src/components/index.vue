<template>
  <div id="indexPage" v-cloak>
    <!-- 头部搜索 -->
    <!-- <keep-alive> -->
    <div class="fixedHead">
      <div class="ipSearch">
        <div class="ipSearchTitle" @click="compareSubmit">
          <span>医生列表</span>
        </div>
        <div class="ipSearchInput">
          <img src="../assets/searchicon.png">
          <!-- <span>{{searchParam}}</span> -->
          <input type="text" v-model="searchParam" placeholder="搜索医生姓名" @keyup.enter="search">
        </div>
        <div class="ipSearchBtn">
          <span @click="compare">对比</span>
        </div>
      </div>
      <!-- :class="tabIndex==index ? 'active':''" -->
      <div class="ipFilter" v-if="titleList">
        <div
          class="ipfItem"
          v-for="(item,index) in titleList"
          :key="index"
          :class="tabIndex==index ? 'active':''"
          @click="filterMsg(index,item.type)"
        >{{item.name}}</div>
      </div>
    </div>
    <!-- 医生列表 -->
    <div class="iplistWrap">
      <div class="ipList" v-if="doctorList" :class="isShowCompare?'paddingMove':''">
        <!-- 对比头像区域 -->
        <div class="compareDomWrap" :class="isShowCompare?'heightMove':''">
          <div class="compareDom" v-if="compareList">
            <div class="compareDomItem" v-for="(item,index) in compareList" :key="index">
              <img :src="item.imgSrc">
              <p>{{item.des}}</p>
              <div class="del" @click="deleteCompareItem(item.docId,index)">
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="ipListItem"
          :style="nowIndex==index?'background:#f3f7fd':''"
          v-for="(item,index) in doctorList"
          :key="index"
          @touchstart="changeBg(index)"
          @click="toPath(index,item.doctorId)"
        >
          <!--多选 -->
          <div
            class="checkboxBtn"
            :class="isShowCompare?'leftMoveBtn':''"
            @click="selectBox(index,item.doctorId,item.doctorName)"
          >
            <img src="../assets/right.png" v-show="item.isCheckBox">
          </div>
          <img
            src="../assets/listHead.png"
            class="userHead"
            :class="isShowCompare?'leftMoveImg':''"
          >
          <div class="ipListItemText" :class="isShowCompare?'leftMoveText':''">
            <div>{{item.doctorName}}</div>
            <p>{{item.hospital}}</p>
            <!-- <p>{{item.des}}</p> -->
          </div>
          <img src="../assets/link.png" class="linkicon">
        </div>
      </div>
    </div>
    <!-- 浮层 -->
    <div class="filterWrap" v-show="isfilterWrapShow" @touchmove.prevent></div>
    <!-- 治疗领域 -->
    <keep-alive>
      <transition name="fade">
        <div class="filterWrapItems" v-show="isShowDiseaseArea">
          <div class="fwiList" v-if="diseaseAreaList" @touchmove="handleScroll">
            <span
              class="fwiItem"
              v-for="(item,index) in diseaseAreaList"
              :style="item.isShow?'background:#8395e2;color:#fff':''"
              :key="index"
              @click="getTabs(index,item.name,item.type)"
            >{{item.name}}</span>
            <i style="display:block;clear:both"></i>
          </div>
          <div class="fwtBtn">
            <button @click="reset('cure')">重置</button>
            <button @click="searchDoctor('cure')">确定</button>
          </div>
        </div>
      </transition>
    </keep-alive>
    <!-- 产品 -->
    <keep-alive>
      <transition name="fade">
        <div class="filterWrapItems" v-show="isShowBrandInfoList">
          <div class="fwiList" v-if="brandInfoList" @touchmove="handleScroll">
            <span
              class="fwiItem"
              v-for="(item,index) in brandInfoList"
              :style="item.isShow?'background:#8395e2;color:#fff':''"
              :key="index"
              @click="getTabs(index,item.name,item.type)"
            >{{item.name}}</span>
            <i style="display:block;clear:both"></i>
          </div>
          <div class="fwtBtn">
            <button @click="reset('product')">重置</button>
            <button @click="searchDoctor('product')">确定</button>
          </div>
        </div>
      </transition>
    </keep-alive>
    <!-- 区域 -->
    <keep-alive>
      <transition name="fade">
        <div class="filterWrapItems" v-show="isShowCityList">
          <div class="fwiList" v-if="cityList" @touchmove="handleScroll">
            <span
              class="fwiItem"
              v-for="(item,index) in cityList"
              :style="item.isShow?'background:#8395e2;color:#fff':''"
              :key="index"
              @click="getTabs(index,item.name,item.type)"
            >{{item.name}}</span>
            <i style="display:block;clear:both"></i>
          </div>
          <div class="fwtBtn">
            <button @click="reset('area')">重置</button>
            <button @click="searchDoctor('area')">确定</button>
          </div>
        </div>
      </transition>
    </keep-alive>
    <div class="compareCue" v-if="isShowCompare">
      <span v-if="this.compareCount == 0" class="comBtn" @click="gotToCompare">做对比</span>
      <span v-else>最多可以对比三位医生</span>
    </div>
  </div>
</template>

<script>
import config from "../until/config.js";
export default {
  name: "index",
  data() {
    return {
      searchParam: "", //搜索条件
      isShowCompareCue: false,
      isShowDiseaseArea: false, //治疗领域显示
      isShowCityList: false, //区域显示
      isShowBrandInfoList: false, //产品显示
      diseaseAreaList: [], //治疗领域
      brandInfoList: [], //产品
      cityList: [], //城市列表
      doctorList: [
        // //医生列表
        // {
        //   doctorId: 22222,
        //   doctorName: "叶定伟1",
        //   hospital: "上海复旦大学肿瘤医院",
        //   des: "复旦肿瘤医院副院长 / CUA泌尿外科主委",
        //   isCheckBox: false,
        //   _index: -1
        // },
        // {
        //   doctorId: 33333,
        //   doctorName: "叶定伟2",
        //   hospital: "上海复旦大学肿瘤医院",
        //   des: "复旦肿瘤医院副院长 / CUA泌尿外科主委",
        //   isCheckBox: false,
        //   _index: -1
        // },
        // {
        //   doctorId: 44444,
        //   doctorName: "叶定伟3",
        //   hospital: "上海复旦大学肿瘤医院",
        //   des: "复旦肿瘤医院副院长 / CUA泌尿外科主委",
        //   isCheckBox: false,
        //   _index: -1
        // },
        // {
        //   doctorId: 555555,
        //   doctorName: "叶定伟",
        //   hospital: "上海复旦大学肿瘤医院",
        //   // des: "复旦肿瘤医院副院长 / CUA泌尿外科主委",
        //   isCheckBox: false
        // }
        // {
        //   doctorId: 66666,
        //   doctorName: "叶定伟",
        //   hos: "上海复旦大学肿瘤医院",
        //   des: "复旦肿瘤医院副院长 / CUA泌尿外科主委",
        //   isCheckBox: false
        // }
      ],
      nowIndex: -1, //记录选择医生的id
      isfilterWrapShow: false, //控制浮层显隐
      tabIndex: -1, //控制titlt切换
      temp: -1, //临时存放id的变量
      preType: "", //前一次点击的title的值
      isTopath: true, //控制医生页面跳转到详情页面
      isDisable: false, //控制单选框禁用状态
      tabsList: [
        //选项卡数据
        { name: "全部", isShow: false },
        { name: "上海", isShow: false },
        { name: "杭州", isShow: false },
        { name: "北京", isShow: false },
        { name: "西安", isShow: false },
        { name: "成都", isShow: false },
        { name: "广州", isShow: false },
        { name: "全部", isShow: false }
      ],
      tabsParamList: [], //选择区域，产品，治疗领域时的tabs
      titleList: [
        {
          name: "治疗领域",
          type: "cure",
          isClick: false
        },
        {
          name: "产品",
          type: "product",
          isClick: false
        },
        {
          name: "区域",
          type: "area",
          isClick: false
        }
      ],
      compareList: [
        //比较者的头像
        {
          des: "可添加1人",
          imgSrc: config.userHead,
          docId: -1,
          1: -1
        },
        {
          des: "可添加1人",
          imgSrc: config.userHead,
          docId: -1,
          2: -1
        },
        {
          des: "可添加1人",
          imgSrc: config.userHead,
          docId: -1,
          3: -3
        }
      ],
      isShowCompare: false, //控制对比头像的显隐
      selectIndex: -1,
      flagIndex: -1,
      delIndex: -1, //记录删除时头像的位置
      compareCount: 0
    };
  },
  created() {
    Array.prototype.remove = function(val) {
      this.map((item, index) => {
        for (let i in item) {
          if (item[i] == val) {
            this.splice(index, 1);
          }
        }
      });
    };
  },
  mounted() {
    // 进入页面加载医生列表数据
    this.requestData(config.getDoctorList, {}, res => {
      res.map(item => {
        return (item.isCheckBox = false);
      });
      this.doctorList = res;
    });
    //加载区域列表
    this.requestData(config.getAreaList, {}, res => {
      this.cityList.push({
        name: "全部",
        isShow: true,
        type: "area"
      });
      res.map(item => {
        this.cityList.push({
          name: item,
          isShow: false,
          type: "area"
        });
      });
      console.log("this.cityList区域列表: ", this.cityList);
    });
    //加载治疗领域列表
    this.requestData(config.getDiseaseAreaList, {}, res => {
      this.diseaseAreaList.push({
        name: "全部",
        isShow: true,
        type: "cure"
      });
      res.map(item => {
        this.diseaseAreaList.push({
          name: item,
          isShow: false,
          type: "cure"
        });
      });
      console.log("this.diseaseAreaList治疗领域列表: ", this.diseaseAreaList);
    });
    //加载获取产品列表
    this.requestData(config.getBrandList, {}, res => {
      this.brandInfoList.push({
        name: "全部",
        isShow: true,
        type: "product"
      });
      res.map(item => {
        this.brandInfoList.push({
          name: item,
          isShow: false,
          type: "product"
        });
      });
      console.log("this.brandInfoList获取产品列表: ", this.brandInfoList);
    });
  },
  watch: {
    compareList: {
      handler: function(val) {
        this.compareCount = 0;
        this.compareList.map(item => {
          if (item["docId"] == -1) {
            this.compareCount += 1;
          }
        });
      },
      deep: true
    }
  },
  methods: {
    gotToCompare() {
      this.$router.push({ path: "/compare" });
    },
    deleteCompareItem(docId, index) {
      this.compareList[index]["docId"] = -1;
      this.compareList[index]["imgSrc"] = config.userHead;
      this.compareList[index]["des"] = "可添加1人";
      this.doctorList.map(item => {
        if (item["doctorId"] == docId) {
          item["isCheckBox"] = false;
        }
      });

      console.log("i+++++++: ", this.compareCount);
    },
    //对比时单选按钮
    selectBox(index, docId, name) {
      let flag = false;
      this.compareList.map(item => {
        if (item["docId"] == -1) {
          flag = true;
        }
      });
      if (flag) {
        if (!this.doctorList[index]["isCheckBox"]) {
          this.doctorList[index]["isCheckBox"] = true;
          for (let i = 0; i < this.compareList.length; i++) {
            if (this.compareList[i]["docId"] == -1 && i < 3) {
              this.compareList[i]["docId"] = this.doctorList[index].doctorId;
              this.compareList[i]["des"] = this.doctorList[index].doctorName;
              this.compareList[i]["imgSrc"] = config.listHead;
              break;
            }
          }
        }
      }
    },
    //做对比
    compareSubmit() {},
    //手指按下改变背景色
    changeBg(index) {
      this.nowIndex = index;
    },
    //dom滚动
    domScroll() {
      let temp = setInterval(function() {
        if (document.getElementsByClassName("fwiList")[0].scrollTop == 0) {
          clearInterval(temp);
        } else {
          document.getElementsByClassName("fwiList")[0].scrollTop -= 5;
        }
      }, 10);
      document.getElementsByTagName("body")[0].style.position = "relative";
      document.getElementsByTagName("body")[0].style.overflow = "auto";
      document.getElementsByTagName("html")[0].style.overflow = "auto";
    },
    //监听滚动时间
    handleScroll(e) {
      let dom = document.getElementsByClassName("fwiList")[0];
      let height = dom.offsetHeight;
      let scrollTop = dom.scrollTop;
      if (scrollTop > height) {
        document.getElementsByTagName("body")[0].style.position = "fixed";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
      }
    },
    //搜索
    search() {
      let cityList = [];
      let diseaseAreaList = [];
      let brandInfoList = [];
      this.cityList.map(item => {
        if (item["isShow"] && item.name != "全部") {
          cityList.push(item.name);
        }
      });
      this.diseaseAreaList.map(item => {
        if (item["isShow"] && item.name != "全部") {
          diseaseAreaList.push(item.name);
        }
      });
      this.brandInfoList.map(item => {
        if (item["isShow"] && item.name != "全部") {
          brandInfoList.push(item.name);
        }
      });
      let param = {
        doctorName: this.searchParam,
        cityList: cityList,
        diseaseAreaList: diseaseAreaList,
        brandInfoList: brandInfoList
      };
      console.log("param: ", param);
      // this.requestData(config.getDoctorList, param, res => {
      //   res.map(item => {
      //     return (item.isCheckBox = false);
      //   });
      //   this.doctorList = res;
      // });
    },
    //对比
    compare() {
      console.log("this.compareCount", this.compareCount);
      this.isTopath = !this.isTopath;
      this.isShowCompare = !this.isShowCompare;
      this.compareList = [
        //比较者的头像
        {
          des: "可添加1人",
          imgSrc: config.userHead,
          docId: -1,
          1: -1
        },
        {
          des: "可添加1人",
          imgSrc: config.userHead,
          docId: -1,
          2: -1
        },
        {
          des: "可添加1人",
          imgSrc: config.userHead,
          docId: -1,
          3: -3
        }
      ];
      this.doctorList.map(item => (item["isCheckBox"] = false));
    },
    //跳转
    toPath(index, doctorId) {
      !this.isTopath ||
        this.$router.push({ name: "detail", params: { id: doctorId } }); //如果isTopath为true就跳转
    },
    requestData(url, param, success, err) {
      this.$http.post(url, param).then(res => {
        if (res.data.code == "success") {
          success(res.data.data);
        } else {
          // err();
        }
      });
    },
    //展示筛选浮层
    filterMsg(index, type) {
      this.tabIndex = index;
      let url = "";
      switch (type) {
        case "area":
          url = config.getAreaList;
          this.isShowBrandInfoList = false;
          this.isShowDiseaseArea = false;
          this.isShowCityList = !this.isShowCityList;
          this.isShowCityList
            ? (this.isfilterWrapShow = true)
            : (this.isfilterWrapShow = false);
          if (!this.isShowCityList) {
            this.tabIndex = -1;
          }
          break;
        case "cure":
          this.isShowBrandInfoList = false;
          this.isShowCityList = false;
          url = config.getDiseaseAreaList;
          this.isShowDiseaseArea = !this.isShowDiseaseArea;
          this.isShowDiseaseArea
            ? (this.isfilterWrapShow = true)
            : (this.isfilterWrapShow = false);
          if (!this.isShowDiseaseArea) {
            this.tabIndex = -1;
          }
          break;
        case "product":
          this.isShowDiseaseArea = false;
          this.isShowCityList = false;
          url = config.getBrandList;
          this.isShowBrandInfoList = !this.isShowBrandInfoList;
          this.isShowBrandInfoList
            ? (this.isfilterWrapShow = true)
            : (this.isfilterWrapShow = false);
          if (!this.isShowBrandInfoList) {
            this.tabIndex = -1;
          }
          break;
      }
    },
    // 选择城市
    getTabs(index, name, type) {
      switch (type) {
        case "area":
          if (name == "全部") {
            this.cityList.map(item => (item.isShow = false));
            this.cityList[0]["isShow"] = true;
          } else {
            this.cityList[0]["isShow"] = false;
            this.cityList[index]["isShow"] = !this.cityList[index]["isShow"];
          }
          break;
        case "cure":
          if (name == "全部") {
            this.diseaseAreaList.map(item => (item.isShow = false));
            this.diseaseAreaList[0]["isShow"] = true;
          } else {
            this.diseaseAreaList[0]["isShow"] = false;
            this.diseaseAreaList[index]["isShow"] = !this.diseaseAreaList[
              index
            ]["isShow"];
          }
          break;
        case "product":
          if (name == "全部") {
            this.brandInfoList.map(item => (item.isShow = false));
            this.brandInfoList[0]["isShow"] = true;
          } else {
            this.brandInfoList[0]["isShow"] = false;
            this.brandInfoList[index]["isShow"] = !this.brandInfoList[index][
              "isShow"
            ];
          }
          break;
      }
    },
    //重置
    reset(type) {
      switch (type) {
        case "cure":
          this.diseaseAreaList.map(item => {
            if (item["name"] != "全部") {
              return (item["isShow"] = false);
            } else {
              return (item["isShow"] = true);
            }
          });
          console.log("this.diseaseAreaList: ", this.diseaseAreaList);
          break;
        case "product":
          this.brandInfoList.map(item => (item["isShow"] = false));
          this.brandInfoList.map(item => {
            if (item["name"] != "全部") {
              return (item["isShow"] = false);
            } else {
              return (item["isShow"] = true);
            }
          });
          break;
        case "area":
          this.cityList.map(item => (item["isShow"] = false));
          this.cityList.map(item => {
            if (item["name"] != "全部") {
              return (item["isShow"] = false);
            } else {
              return (item["isShow"] = true);
            }
          });
          break;
      }
    },
    //确定
    searchDoctor() {
      this.domScroll();
      this.isfilterWrapShow = false;
      this.isShowDiseaseArea = false;
      this.isShowCityList = false;
      this.isShowBrandInfoList = false;
      let cityList = [];
      let diseaseAreaList = [];
      let brandInfoList = [];
      this.cityList.map(item => {
        if (item["isShow"] && item.name != "全部") {
          cityList.push(item.name);
        }
      });
      this.diseaseAreaList.map(item => {
        if (item["isShow"] && item.name != "全部") {
          diseaseAreaList.push(item.name);
        }
      });
      this.brandInfoList.map(item => {
        if (item["isShow"] && item.name != "全部") {
          brandInfoList.push(item.name);
        }
      });
      let param = {
        doctorName: this.searchParam || "",
        cityList: cityList,
        diseaseAreaList: diseaseAreaList,
        brandInfoList: brandInfoList
      };
      console.log("param确定: ", param);
      this.requestData(config.getDoctorList, param, res => {
        console.log("res搜索 ", res);
        res.map(item => {
          return (item.isCheckBox = false);
        });
        this.doctorList = res;
      });
    }
  }
};
</script>

<style lang="scss">
//移动位置
.leftMoveImg {
  left: 0.86rem !important;
}
.leftMoveText {
  left: 0.52rem !important;
}
.leftMoveBtn {
  left: 0.2rem !important;
}
.heightMove {
  height: 2.7rem !important;
}
.paddingMove {
  padding-top: 5rem !important;
}

@mixin moveleft {
  transition: all 0.5s;
}
@mixin divCenter {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
[v-cloak] {
  display: none;
}

#indexPage {
  height: 100%;
  box-sizing: border-box;
  background: #fff;
}
.fixedHead {
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: #ffffff;
  z-index: 4;
}
.filterWrap {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.8;
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: hidden;
}
.filterWrapItems {
  width: 100%;
  height: 4.09rem;
  background: #ffffff;
  position: fixed;
  top: 2.26rem;
  left: 0;
  z-index: 3;
}
.fwtBtn {
  width: 100%;
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.fwtBtn button {
  float: left;
  outline: none;
  width: 50%;
  text-align: center;
  line-height: 0.9rem;
  font-family: PingFangSC-Regular;
  font-size: 0.32rem;
  float: left;
  padding: 0;
  margin: 0;
  border: none;
  border-top: 1px solid #f1f1f1;
  // border-bottom: 1px solid #f1f1f1;
}
.fwtBtn button:last-of-type {
  background: #f2568b;
  color: #ffffff;
}
.fwtBtn button:first-of-type {
  background: #ffffff;
}
//@
.fwiList {
  height: 3.2rem;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  padding-left: 0.39rem;
  padding-bottom: 0.2rem;
}
.fwiList span {
  float: left;
  font-family: PingFangSC-Regular;
  font-size: 0.26rem;
  color: #333333;
  // width: 1.5rem;
  height: 0.64rem;
  line-height: 0.64rem;
  text-align: center;
  margin-right: 0.24rem;
  background-color: #f7f7fb;
  border-radius: 0.32rem;
  margin-top: 0.3rem;
  padding: 0 0.3rem;
}
.blackHeight {
  width: 100%;
  height: calc(100% - 4.09rem);
  background-color: #000;
  opacity: 0.8;
}
.ipSearch {
  padding: 0 0.31rem 0 0.26rem;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  height: 1.42rem;
}
.ipSearch > div {
  float: left;
  position: relative;
}
.ipSearchTitle {
  margin-right: 0.47rem;
  line-height: 1.42rem;
}
.ipSearchTitle span {
  display: block;
  font-size: 0.4rem;
  font-family: PingFangSC-Semibold;
  color: #222222;
}
.ipSearchInput {
  font-size: 0.28rem;
  position: relative;
  @include divCenter;
}
.ipSearchInput img {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  left: 0.81rem;
  top: 50%;
  transform: translateY(-50%);
}
.ipSearchInput input {
  padding-left: 1.17rem;
  width: 3.58rem;
  height: 0.73rem;
  line-height: 0.73rem;
  background-color: #f6f7f8;
  border-radius: 0.37rem;
  border: none;
  outline: none;
  font-family: PingFangSC-Light;
  box-sizing: border-box;
}
.ipSearchBtn {
  margin-left: 0.35rem;
}
.ipSearchBtn span {
  display: block;
  font-size: 0.28rem;
  width: 0.93rem;
  height: 0.57rem;
  background-color: #8fa1ee;
  border-radius: 0.34rem;
  text-align: center;
  color: #ffffff;
  line-height: 0.57rem;
  position: absolute;
  top: 0.735rem;
  transform: translateY(-50%);
  font-family: PingFangSC-Regular;
  padding-top: 1px;
  box-sizing: border-box;
}
.ipFilter {
  display: flex;
  font-family: PingFangSC-Regular;
  box-shadow: 0px 1px 0px 0px rgba(114, 114, 114, 0.5);
  box-sizing: border-box;
}
.ipfItem {
  font-size: 0.32rem;
  flex: 1;
  line-height: 0.84rem;
  color: #111111;
  text-align: center;
}

.active {
  border-bottom: 2px solid #6e84e5;
}
.iplistWrap {
  height: 10.33rem;
  box-sizing: border-box;
}
.ipList {
  padding-top: 2.31rem;
  overflow-y: scroll;
  @include moveleft;
  transition-delay: 0.5s;
  overflow-x: hidden;
  .ipListItem {
    // height: 2.07rem;
    padding: 0.34rem 0.32rem 0.36rem 0.34rem;
    box-sizing: border-box;
    position: relative;
    background: #fff;
    border-bottom: solid 1px #e2e2e2;
  }
}
.ipListItemText {
  margin-left: 1.4rem;
  position: relative;
  left: 0px;
  @include moveleft;
}

.ipListItem > img:first-of-type {
  width: 0.98rem;
  height: 0.98rem;
  @include divCenter;
  left: 0.34rem;
  @include moveleft;
}
.ipListItem > img:last-of-type {
  width: 0.16rem;
  height: 0.3rem;
  @include divCenter;
  right: 0.31rem;
}

.ipListItemText > div {
  font-family: PingFangSC-Medium;
  font-size: 0.32rem;
  color: #222222;
}
.ipListItemText > p {
  margin: 0px;
  font-family: PingFangSC-Regular;
  font-size: 0.28rem;
  color: #666666;
  margin-top: 0.21rem;
}

// 对比
.compareDomWrap {
  width: 100%;
  height: 0;
  overflow: hidden;
  @include moveleft;
  transition-delay: 0.5s;
  position: fixed;
  top: 2.23rem;
  left: 0;
  z-index: 1;
}
.compareDom {
  display: flex;
  border-bottom: solid 1px #e2e2e2;
  padding-top: 0.36rem;
  height: 2.7rem;
  box-sizing: border-box;
  background: #fff;
}
.compareDomItem {
  flex: 1;
  position: relative;
}
.compareDomItem img {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  margin: 0 auto;
  border-radius: 100%;
}
.compareDomItem p {
  font-family: PingFangSC-Regular;
  font-size: 0.31rem;
  color: #999999;
  text-align: center;
}
.del {
  position: absolute;
  bottom: 0.8rem;
  right: 0.5rem;
  width: 0.39rem;
  height: 0.39rem;
  background-color: #fb5b92;
  border-radius: 100%;
}
.del span {
  width: 0.23rem;
  height: 0.06rem;
  display: block;
  background-color: #ffffff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  transform: translate(-50%);
}

//多选按钮
.checkboxBtn {
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 16px;
  border: solid 2px #dcdcdc;
  @include divCenter;
  left: -0.44rem;
  @include moveleft;
  box-sizing: border-box;
}
.checkboxBtn img {
  width: 0.32rem;
  height: 0.32rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.compareCue {
  position: fixed;
  bottom: 0px;
  left: 0px;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  padding: 0.22rem 0px;
  color: #888888;
  font-family: PingFangSC-Regular;
  font-size: 0.26rem;
  text-align: center;
  box-shadow: 0px 0px 0.29rem 0px rgba(191, 191, 191, 0.5);
  opacity: 0.87;
}
.comBtn {
  display: block;
  width: 5.66rem;
  text-align: center;
  padding: 0.29rem 0;
  margin: 0 auto;
  background-color: #ec5d91;
  border-radius: 50px;
  color: #fff;
  font-size: 0.3rem;
}
</style>
