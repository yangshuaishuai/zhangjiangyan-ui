<template>
  <div id="submitsuccess">
    <submit-result :title="title" content="" @back="back" btnTitle="我知道了" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "录入成功，稍后查看结果",
    };
  },
  created() {
    if (this.$route.query.title) {
      this.title = this.$route.query.title;
    }
  },
  methods: {
    back() {
      if (this.$route.query.title) {
        this.$router.go(-1);
      } else {
        this.$router.replace({ name: "index" });
      }
    },
  },
};
</script>

<style scoped lang="less">
#submitsuccess {
  height: 100%;
  background: #f7f7f7;
}
</style>
