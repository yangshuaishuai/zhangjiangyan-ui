<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="keyWord"
        placeholder="请输入客户名称"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <van-list
      v-model="custloading"
      :finished="custfinished"
      finished-text="没有更多了"
      @load="onLoadcust"
      :immediate-check="false"
      offset="50"
    >
      <div class="list-item" v-for="(item, i) in custList" :key="i">
        <div class="left">
          <span class="title">{{ item.custName }}</span>
          <span class="text">联系方式：{{ item.custPhone }}</span>
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
      // 客户列表
      custList: [],
      custloading: false,
      custfinished: false,
      custpageIndex: 1,
      pageSize: 15,
    };
  },
  created() {
    this.routeQuery = this.$route.query;
    this.getCustList();
  },
  methods: {
    onLoadcust() {
      if (this.custList.length > 0) {
        this.custpageIndex += 1;
        this.getCustList();
      }
    },
    getCustList() {
      // 获取客户列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        isDraft: "0",
        keyWord: this.keyWord,
      };
      if (this.routeQuery.name == "activeDetail") {
        query.actInfoId = this.routeQuery.actInfoId;
        query.actInfoIdFz = "0"; //"0-查看已关联客户 1-查看未关联客户"
      } else if (this.routeQuery.name == "channelDetail") {
        query.channelId = this.routeQuery.channelId;
        query.channelIdFz = "0"; //"0-查询所属于该渠道 1-不属于任何渠道"
      }
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(
        query,
        this.custpageIndex,
        this.pageSize
      );
      this.$http(`querySamllRoadshowCustomerByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.custloading = false;
          if (this.custpageIndex * this.pageSize >= resData.total) {
            this.custfinished = true;
          } else {
            this.custfinished = false;
          }
          this.custTotal = resData.total;
          this.custList =
            this.custpageIndex == 1
              ? resData.list
              : this.custList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onSearch() {
      this.custpageIndex = 1;
      this.channelList = [];
      this.getCustList();
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