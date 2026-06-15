<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="keyWord"
        placeholder="请输入渠道名称"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <van-list
      v-model="channelloading"
      :finished="channelfinished"
      finished-text="没有更多了"
      @load="onLoadchannel"
      :immediate-check="false"
      offset="50"
    >
      <div class="list-item" v-for="(item, i) in channelList" :key="i">
        <div class="left">
          <span class="title">{{ item.channelBTypeName }}</span>
          <span class="text">渠道类型：{{ item.channelTypeName }}</span>
        </div>
      </div>
    </van-list>
    <div style="height: 100px"></div>
    <div class="footer">
      <div class="btns">
        <van-button
          class="btn"
          type="info"
          plain
          @click="goBack"
          color="#5176E0"
          >返回</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyWord: "",
      routeQuery: {},
      // 渠道列表
      channelList: [],
      channelloading: false,
      channelfinished: false,
      pageIndex: 1,
      pageSize: 15,
    };
  },
  created() {
    this.routeQuery = this.$route.query;
    this.getChannelList();
  },
  methods: {
    getChannelList() {
      // 获取渠道列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        actInfoId: this.routeQuery.actInfoId,
        keyWord: this.keyWord,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      this.$http(`querySamllRoadshowChannelInfoByActId`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.channelloading = false;
          if (this.pageIndex * this.pageSize >= resData.total) {
            this.channelfinished = true;
          } else {
            this.channelfinished = false;
          }
          this.channelList =
            this.pageIndex == 1
              ? resData.list
              : this.channelList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onLoadchannel() {
      if (this.channelList.length > 0) {
        this.pageIndex += 1;
        this.getChannelList();
      }
    },
    onSearch() {
      this.pageIndex = 1;
      this.channelList = [];
      this.getChannelList();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.pages {
  width: 100%;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100%;
  .van-list {
    flex: 1;
    height: 0;
    overflow-y: auto;
    .list-item {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px;
      background: #fff;
      border-radius: 18px;
      .left {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: bold;
          font-size: 30px;
          color: #393b3f;
        }
        .text {
          padding-top: 20px;
          color: #99a0af;
          font-size: 28px;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    .btns {
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
  }
}
</style>