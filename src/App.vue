<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {};
  },
  created() {
    if (process.env.NODE_ENV == "development") {
      this.$store.state.proxyURL = "http://20.147.170.3:9125/roadshow/";
      this.$store.state.BASEURL = "http://20.240.27.174:7002/uepsJSYOUJIEapi/";
      this.$store.state.FILEURL =
        "http://20.147.170.5:7050/file-manage-transfer/";
      //   // 信创
      this.$store.state.proxyURL =
        "http://20.147.170.5:8888/uepsJSYOUJIEapi/roadshow/roadshow/";
    } else if (process.env.NODE_ENV === "test") {
      //邮捷测试环境
      //   this.$store.state.proxyURL =
      //     "https://jstest.91betterwei.com/jgwl/roadshow/roadshow/";
      //   this.$store.state.BASEURL = "https://jstest.91betterwei.com/";
      //   this.$store.state.FILEURL =
      //     "https://jstest.91betterwei.com/jgwl/file-manage-transfer/";
      //   // 信创
      let urlHost = new URL(window.location.href).hostname;
      let urlPort = new URL(window.location.href).port;
      let hostPortUrl = "http://" + urlHost + ":" + urlPort;
      this.$store.state.proxyURL =
        hostPortUrl + "/uepsJSYOUJIEapi/roadshow/roadshow/";
      this.$store.state.BASEURL = hostPortUrl + "/uepsJSYOUJIEapi/";
      this.$store.state.FILEURL = "http://20.147.170.4:8953/";
      this.$store.state.client = "xinchuang";
    } else {
      //   this.$store.state.proxyURL =
      //     "https://wap.jiangsu.psbc.com/jgwl/roadshow/roadshow/";
      //   this.$store.state.BASEURL = "https://wap.jiangsu.psbc.com/";
      //   this.$store.state.FILEURL =
      //     "https://wap.jiangsu.psbc.com/jgwl/fileManageTransfer-api/";
      //   // 邮连接口
      let urlHost = new URL(window.location.href).hostname;
      let urlPort = new URL(window.location.href).port;
      let hostPortUrl = "http://" + urlHost + ":" + urlPort;
      this.$store.state.proxyURL =
        hostPortUrl + "/uepsJSYOUJIEapi/roadshow/roadshow/";
      this.$store.state.BASEURL = hostPortUrl + "/uepsJSYOUJIEapi/";
      this.$store.state.client = "xinchuang";
    }
  },
  mounted() {},
  methods: {},
};
</script>
<style>
@import "./assets/css/base.css";
</style>
