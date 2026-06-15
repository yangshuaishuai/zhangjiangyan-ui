<template>
  <div id="button-group">
    <!-- 返回 -->
    <van-button
      class="btn"
      native-type="button"
      plain
      type="info"
      block
      @click="staging"
      >{{ text1 }}</van-button
    >
    <!-- 提交 -->
    <van-button
      class="btn"
      native-type="button"
      type="info"
      block
      @click="finalSubmit"
      color="#5176E0"
      >{{ text2 }}</van-button
    >
  </div>
</template>

<script>
export default {
  name: "button-group",
  props: {
    text1: {
      type: String,
      default: "返回",
    },
    text2: {
      type: String,
      default: "提交",
    },
  },
  methods: {
    staging() {
      // 暂存
      this.$emit("staging");
    },
    finalSubmit() {
      // 提交
      this.$emit("finalSubmit");
    },
  },
};
</script>

<style scoped lang="less">
#button-group {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .btn {
    flex: 1;
    margin: 0 5px;
    border-radius: 12px;
  }
}
</style>
