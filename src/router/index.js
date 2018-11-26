import Vue from "vue";
import Router from "vue-router";
import compare from "@/components/compare";
import index from "@/components/index";
import detail from "@/components/detail";
import notfount from "@/components/notfount";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: '/kee/',
  routes: [{
      path: "/",
      name: "index",
      component: index,
      meta: {
        keepAlive: true //需要被缓存的组件
      },
      // children: [
      //   {
      //     // 当 /user/:id/profile 匹配成功，
      //     // UserProfile 会被渲染在 User 的 <router-view> 中
      //     path: "index",
      //     component: index
      //   }
      // ]
    },
    {
      path: "/index",
      name: "index",
      component: index,
      meta: {
        keepAlive: true //需要被缓存的组件
      },
    },
    {
      path: "/detail",
      name: "detail",
      component: detail,
      meta: {
        keepAlive: false //需要被缓存的组件
      },
    },
    {
      path: "/compare",
      name: "compare",
      component: compare,
      meta:{
        keepAlive:false //需要被缓存的组件
     },
    },
    {
      path: "*",
      name: "notfount",
      component: notfount
    }
  ]
});