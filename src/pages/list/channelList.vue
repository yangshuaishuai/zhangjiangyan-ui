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
                <span class="title">{{ item.channelBTypeName }}</span>
                <span class="text"
                  >渠道类型：{{ item.actChannelTypeName }}</span
                >
                <span class="text">B端类型：{{ item.channelTypeName }}</span>
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
                <span class="title">{{ item.channelBTypeName }}</span>
                <span class="text"
                  >渠道类型：{{ item.actChannelTypeName }}</span
                >
                <span class="text">B端类型：{{ item.channelTypeName }}</span>
              </div>
            </div>
          </van-checkbox>
        </div>
      </van-checkbox-group>
    </van-list>
    <div style="height: 100px"></div>
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
      fromPath: "",
    };
  },
  created() {
    this.fromPath = this.$route.query.fromPath;
    this.name = this.$route.query.name;
    var dataInfo = {};
    if (this.name == "addCustInfo") {
      dataInfo = JSON.parse(sessionStorage.getItem("relateCustInfo"));
    } else {
      if (this.name == "addCustVisit") {
        dataInfo = JSON.parse(sessionStorage.getItem("khdataInfo"));
      } else {
        dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      }
    }
    this.routeQuery = dataInfo;
    console.log(this.routeQuery, "qqqqqqqqqqq");
    this.name = this.$route.query.name;
    this.type = this.$route.query.type;
    this.getList();
  },
  methods: {
    async getList() {
      var query;
      var actInfoId = "";
      // 关联渠道时需穿活动id
      if (this.name == "activeDetail") {
        actInfoId = this.routeQuery.actInfoId;
      }
      query = {
        yjToken: sessionStorage.getItem("yjToken"),
        isDraft: "0",
        keyWord: this.keyWord,
        actInfoId: actInfoId,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http(`querySamllRoadshowChannelInfoByPage`, {
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
          this.$toast("请选择所属渠道");
          return;
        }
        this.routeQuery.channelBTypeName = this.radio.channelBTypeName;
        this.routeQuery.channelId = this.radio.channelId;
        // 新增信息
        this.routeQuery.actChannelType = this.radio.actChannelType;
        this.routeQuery.actChannelTypeName = this.radio.actChannelTypeName;
        this.routeQuery.channelTypeName = this.radio.channelTypeName;
        this.routeQuery.channelBType = this.radio.channelBType;
        if (
          (this.name == "editCustInfo" || this.name == "editCbInfo") &&
          !this.routeQuery.actName
        ) {
          // 编辑客户时所属活动与所属渠道至少选一个时优先使用所属活动的机构信息,若没有选择所属活动则用所属渠道的机构信息
          //   this.routeQuery.orgId = this.radio.orgId;
          //   this.routeQuery.orgName = this.radio.orgName;
          //   this.routeQuery.upOrgId = this.radio.upOrgId;
          //   this.routeQuery.upOrgName = this.radio.upOrgName;
        }
        if (this.name == "addCustInfo") {
          sessionStorage.setItem(
            "relateCustInfo",
            JSON.stringify(this.routeQuery)
          );
        } else {
          if (this.name == "addCustVisit") {
            sessionStorage.setItem(
              "khdataInfo",
              JSON.stringify(this.routeQuery)
            );
          } else {
            sessionStorage.setItem("dataInfo", JSON.stringify(this.routeQuery));
          }
        }
        this.$router.replace({
          name: this.name,
          query: {
            fromPath: this.fromPath,
          },
        });
      } else if (this.type == "checkbox") {
        // 多选
        if (!this.result.length) {
          this.$toast("请选择所属渠道");
          return;
        }
        var arr = [];
        this.result.map((item, i) => {
          arr.push(item.channelId);
        });
        this.routeQuery.channelIds = arr;
        console.log(this.routeQuery, "---");
        this.routeQuery.yjToken = sessionStorage.getItem("yjToken");
        console.log(this.routeQuery, "请求参数");
        var encryData = this.getisEncParams(this.routeQuery);
        this.$http("saveSamllRoadshowActAndChannelInfo", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            this.$router.replace({
              name: "submitsuccess",
              query: { title: "关联成功", fromPath: this.fromPath },
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
