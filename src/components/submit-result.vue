<template>
  <div id="submitresult">
    <main>
      <p>
        <img
          v-if="title.includes('成功')"
          src="../assets/img/gou-blue.png"
          alt=""
        />
        <img v-else src="../assets/img/err.png" alt="" />
        {{ title }}
      </p>
      <p>{{ content }}</p>
      <slot></slot>
      <van-button round @click="back">{{ btnTitle }}</van-button>
    </main>
  </div>
</template>

<script>
export default {
  props: ["title", "content", "btnTitle"],
  name: "submit-result",
  methods: {
    back() {
      this.$emit("back");
    },
  },
};
</script>

<style scoped lang="less">
#submitresult {
  height: 100%;
  background: #f7f7f7;
  padding: 20px;
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 16px;
    padding: 60px 0;
    p {
      font-size: 26px;
      color: #696c77;
      padding-bottom: 40px;
    }
    p:first-of-type {
      font-size: 36px;
      font-weight: 600;
      padding-bottom: 10px;
    }
    img {
      width: 36px;
      padding-right: 10px;
      vertical-align: middle;
    }
    button {
      width: 220px;
      color: #393b3f;
      font-size: 30px;
    }
  }
}
</style>
