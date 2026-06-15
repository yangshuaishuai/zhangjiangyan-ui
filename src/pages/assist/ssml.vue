<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="userName"
        placeholder="请搜索姓名"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
    >
      <!-- 单选 -->
      <van-radio-group v-model="radio">
        <div class="radioItem" v-for="(item, index) in dataLists" :key="index">
          <van-radio :name="item">
            <div class="list-item">
              <div class="left">
                <span class="title"
                  >{{ item.userName }}（{{ item.userId }}）</span
                >
                <span class="text">机构名称：{{ item.instName }}</span>
                <span class="text">机构号：{{ item.instId }}</span>
              </div>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
    </van-list>
    <div style="height: 70px"></div>
    <div class="footer">
      <div class="btns">
        <van-button class="btn" native-type="button" block @click="goBack"
          >返回</van-button
        >
        <van-button
          class="btn"
          native-type="button"
          type="info"
          block
          @click="confirm"
          color="#5176E0"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      dataLists: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 15,
      radio: "",
      routeQuery: {},
    };
  },
  created() {
    this.routeQuery = this.$route.query;
    console.log(this.routeQuery);
    this.getList();
  },
  methods: {
    async getList() {
      var encryData = this.getisEncParams(
        { userName: this.userName },
        this.pageIndex,
        this.pageSize
      );
      await this.$http(`queryAllUserInfo`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          // 对数据进行解密
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.loading = false;
          if (this.pageIndex * this.pageSize >= resData.total) {
            this.finished = true;
          } else {
            this.finished = false;
          }
          this.dataLists =
            this.pageIndex == 1
              ? resData.list
              : this.dataLists.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onSearch() {
      this.pageIndex = 1;
      this.dataLists = [];
      this.getList();
    },
    onLoad() {
      if (this.dataLists.length > 0) {
        this.pageIndex += 1;
        this.getList();
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    async confirm() {
      console.log(this.radio);
      // 单选
      if (!this.radio) {
        this.$toast("请选择移交人员！");
        return;
      }
      var query = {
        ...this.radio,
        yjToken: sessionStorage.getItem("yjToken"),
        custId: this.routeQuery.custId,
      };
      if (query.instLvl == "1") {
        query.gsInstId = query.instId;
        query.gsInstName = query.instName;
      } else if (query.instLvl == "2") {
        query.gsInstId = query.upOrgId;
        query.gsInstName = query.upOrgName;
      } else if (query.instLvl == "3") {
        query.gsInstId = query.orgId;
        query.gsInstName = query.orgName;
      } else {
        query.gsInstId = query.ezOrgId;
        query.gsInstName = query.ezOrgName;
      }
      console.log(query, "确认移交参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http("yjCustomer", {
        ...encryData.encryQuery,
        isEnc: 1,
      }).then((res) => {
        this.$router.replace({
          name: "submitsuccess",
          query: {
            title: "移交成功",
          },
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.pages {
  // min-height: 100%;
  width: 100%;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100%;
  .top {
    .btns {
      width: 100%;
      box-sizing: border-box;
      text-align: right;
      padding: 20px 20px 0;
      display: flex;
      justify-content: space-between;
      .btn {
        color: #fff;
        padding: 20px;
        border-radius: 33px;
        background: #5176e0;
        display: flex;
        align-items: center;
        width: 186px;
        height: 66px;
        box-sizing: border-box;
        justify-content: center;
        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
      }
    }
  }
  .van-list {
    flex: 1;
    height: 0;
    overflow-y: auto;
    .radioItem {
      display: flex;
      padding: 0px 20px;
      margin: 20px;
      background: #fff;
      flex: 1;
      border-radius: 18px;
      .van-radio,
      .van-checkbox {
        width: 100%;
      }
    }
    .list-item {
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: bold;
          font-size: 30px;
          color: #393b3f;
        }
        .text {
          padding-top: 10px;
          color: #99a0af;
          font-size: 26px;
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
