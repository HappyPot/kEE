<template>
  <div id="app">
    <keep-alive include="index">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import api from "./until/config.js";
import loading from "./components/loading";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Loading: loading
  },
  computed: {},
  mounted() {
    // this.$http.post("http://192.3123/", {}).then(res => {});
  },
  methods: {
    add(type) {
      this.$store.dispatch("set_name", "111");
    }
  }
};
</script>

<style lang="scss">
</style>
