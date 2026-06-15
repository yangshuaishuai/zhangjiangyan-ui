<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="keyWord"
        placeholder="请输入客户姓名"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <!-- <div class="btns">
        <div></div>
        <div class="btn" @click="gotoAddCust">
          <img src="../../assets/img/addIcon.png" alt="" />
          <span>新建</span>
        </div>
      </div> -->
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
      <van-radio-group v-model="radio" v-if="type == 'radio'">
        <div class="radioItem" v-for="(item, index) in dataLists" :key="index">
          <van-radio :name="item">
            <div class="list-item">
              <div class="left">
                <span class="title">{{ item.custName }}</span>
                <span class="text">联系方式：{{ item.custPhone }}</span>
              </div>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
      <!-- 多选 -->
      <van-checkbox-group v-model="result" v-if="type == 'checkbox'">
        <div class="radioItem" v-for="(item, index) in dataLists" :key="index">
          <van-checkbox :name="item" shape="square">
            <div class="list-item">
              <div class="left">
                <span class="title">{{ item.custName }}</span>
                <span class="text">联系方式：{{ item.custPhone }}</span>
              </div>
            </div>
          </van-checkbox>
        </div>
      </van-checkbox-group>
    </van-list>
    <div style="height: 70px"></div>
    <div class="footer">
      <div class="btns">
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
      keyWord: "",
      dataLists: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      total: "", //总数
      radio: "",
      result: [],
      routeQuery: {}, //跳转参数
      name: "", //跳转前的
      type: "", //checkbox多选  radio单选
      custBelongTiaoxianList: JSON.parse(
        sessionStorage.getItem("custBelongTiaoxianList")
      ), //客户条线
    };
  },
  created() {
    var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    this.routeQuery = dataInfo;
    this.name = this.$route.query.name;
    this.type = this.$route.query.type;
    this.getList();
  },
  methods: {
    gotoAddCust() {
      console.log(this.routeQuery, "---");
      var relateCustInfo = {
        actInfoId: this.routeQuery.actInfoId,
        orgId: this.routeQuery.orgId,
        orgName: this.routeQuery.orgName,
        upOrgId: this.routeQuery.upOrgId,
        upOrgName: this.routeQuery.upOrgName,
        actName: this.routeQuery.actName,
      };
      sessionStorage.setItem("relateCustInfo", JSON.stringify(relateCustInfo));
      console.log("编辑");
      this.$router.replace({
        name: "editCustInfo",
        query: {
          fromPath: "custList",
        },
      });
    },
    async getList() {
      var query;
      query = {
        yjToken: sessionStorage.getItem("yjToken"),
        isDraft: "0",
        keyWord: this.keyWord,
      };
      if (this.name == "activeDetail") {
        query.actInfoId = this.routeQuery.actInfoId;
        query.actInfoIdFz = "1";
      } else if (this.name == "channelVisit") {
        query.channelId = this.routeQuery.channelId;
        query.channelIdFz = "1"; //"0-查询所属于该渠道 1-不属于任何渠道"
      }
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http(`querySamllRoadshowCustomerByPage`, {
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
    confirm() {
      if (this.type == "radio") {
        // 单选
        if (!this.radio) {
          this.$toast("请选择客户");
          return;
        }
        this.routeQuery.custName = this.radio.custName;
        this.routeQuery.custId = this.radio.custId;
        sessionStorage.setItem("dataInfo", JSON.stringify(this.routeQuery));
        this.$router.replace({
          name: this.name,
        });
      } else if (this.type == "checkbox") {
        // 多选
        if (!this.result.length) {
          this.$toast("请选择客户");
          return;
        }
        var arr = [];
        var pramaCustList = [];
        this.result.map((item, i) => {
          arr.push(item.custId);
          pramaCustList.push({
            custId: item.custId,
            custName: item.custName,
            custBelongTiaoxian: item.custBelongTiaoxian,
            custPhone: item.custPhone,
          });
        });
        this.routeQuery.custIds = arr;
        console.log(this.routeQuery, "---");
        this.routeQuery.yjToken = sessionStorage.getItem("yjToken");
        console.log(this.routeQuery, "请求参数");
        var encryData = this.getisEncParams(this.routeQuery);
        var url = "";
        if (this.name == "channelVisit") {
          url = "saveSamllRoadshowChannelAndCustInfo";
        } else {
          url = "saveSamllRoadshowActAndCustInfo";
        }
        this.$http(url, {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            this.$router.replace({
              name: "submitsuccess",
              query: { title: "关联成功" },
            });
          })
          .catch((err) => {
            console.log(err, "错误");
          });
      }
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