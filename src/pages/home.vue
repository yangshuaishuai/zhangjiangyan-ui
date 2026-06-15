<template>
  <div class="pages">
    <div v-if="collapses.length">
      <van-collapse v-model="activeName" accordion @change="collapseChange">
        <van-list
          v-model="parentLoading"
          :finished="parentFinished"
          finished-text="没有更多了"
          @load="onparentLoad"
          :immediate-check="false"
          offset="50"
        >
          <van-collapse-item
            :name="collapse.cjInfoId"
            v-for="(collapse, i) in collapses"
          >
            <template #title>
              <div v-on:click="collapseItemClick(collapse)">
                {{ collapse.cjName }}
              </div>
            </template>
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :immediate-check="false"
              offset="50"
            >
              <div class="items">
                <van-radio-group v-model="radio">
                  <div class="list-item" v-for="(item, index) in dataLists">
                    <van-radio :name="item">
                      <div class="left">
                        <span class="title"> {{ item.cjName }}</span>
                        <span class="text" v-if="item.description">{{
                          item.description
                        }}</span>
                      </div>
                    </van-radio>
                  </div>
                </van-radio-group>
              </div>
            </van-list>
          </van-collapse-item>
        </van-list>
      </van-collapse>
    </div>
    <van-empty v-else :image="image" description="暂无数据"></van-empty>
    <div class="footer">
      <button-group
        @finalSubmit="finalSubmit"
        @staging="goBack"
        text1="返回"
        text2="确定"
      ></button-group>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      radio: "",
      yjToken: "",
      activeName: "",
      parentLoading: false,
      parentFinished: false,
      parentPageIndex: 1,
      parentPageSize: 20,
      collapses: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      dataLists: [],
      image: require("../assets/img/empty-image.png"),
      name: {}, //跳转前的
      routeQuery: {}, //跳转参数
      title: "", //一级场景名称
    };
  },
  created() {
    this.name = this.$route.query.name;
    if (this.name == "addChannelVisit") {
      this.routeQuery = JSON.parse(sessionStorage.getItem("qddataInfo"));
    } else if (this.name == "addCustVisit") {
      this.routeQuery = JSON.parse(sessionStorage.getItem("khdataInfo"));
    } else {
      this.routeQuery = JSON.parse(sessionStorage.getItem("dataInfo"));
    }
    this.yjToken = sessionStorage.getItem("yjToken");
    this.getparentList();
  },
  methods: {
    onparentLoad() {
      if (this.collapses.length > 0) {
        this.parentPageIndex += 1;
        this.getparentList();
      }
    },
    async getparentList() {
      var query = {
        yjToken: this.yjToken,
        parentId: "0",
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(
        query,
        this.parentPageIndex,
        this.parentPageSize
      );
      await this.$http(`querySamllRoadshowCjInfoByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          // 对数据进行解密
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.parentLoading = false;
          if (this.parentPageIndex * this.parentPageSize >= resData.total) {
            this.parentFinished = true;
          } else {
            this.parentFinished = false;
          }
          this.collapses =
            this.parentPageIndex == 1
              ? resData.list
              : this.collapses.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onLoad() {
      if (this.dataLists.length > 0) {
        this.pageIndex += 1;
        this.getList(this.activeName);
      }
    },
    async getList(cjInfoId) {
      var query = {
        yjToken: this.yjToken,
        parentId: cjInfoId,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http(`querySamllRoadshowCjInfoByPage`, {
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
    collapseChange(e) {
      console.log(e, this.activeName);
      this.activeName = e;
      if (e || e == "0") {
        this.pageIndex = 1;
        this.dataLists = [];
        this.getList(e);
      }
    },
    collapseItemClick(e) {
      console.log(e, "****");
      this.$nextTick(() => {
        this.title = e.cjName;
        console.log("一级场景//////", this.title);
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    async finalSubmit() {
      if (!this.radio) {
        this.$toast("请选择所属场景！");
        return;
      }
      console.log(this.radio, "点击确定");
      if (this.name == "editActiveInfo") {
        this.routeQuery.cjName = this.radio.parentNameAndCjName;
        this.routeQuery.cjInfoId = this.radio.cjInfoId;
      } else {
        this.routeQuery.cjYjName = this.radio.description;
        this.routeQuery.cjYjInfoId = this.radio.parentId;
        this.routeQuery.cjName = this.radio.cjName;
        this.routeQuery.cjInfoId = this.radio.cjInfoId;
      }
      if (this.name == "addChannelVisit") {
        sessionStorage.setItem("qddataInfo", JSON.stringify(this.routeQuery));
      } else if (this.name == "addCustVisit") {
        sessionStorage.setItem("khdataInfo", JSON.stringify(this.routeQuery));
      } else {
        // if (this.name == "editChannelInfo") {
        //   // 渠道类型
        //   this.routeQuery.actChannelTypeName = "";
        //   this.routeQuery.actChannelType = "";
        //   // 具体B端类型
        //   this.routeQuery.channelTypeName = "";
        //   this.routeQuery.channelBType = "";
        //   if (this.title == "场景") {
        //     await this.getActChannelType();
        //   }
        // } else if (this.name == "editCustInfo" || this.name == "editCbInfo") {
        //   this.routeQuery.professionName = "";
        //   this.routeQuery.xfHy = "";
        // } else if (this.name == "editActiveInfo") {
        //   this.routeQuery.professionName = "";
        //   this.routeQuery.actProfession = "";
        // }
        sessionStorage.setItem("dataInfo", JSON.stringify(this.routeQuery));
      }
      this.$router.replace({
        name: this.name,
      });
    },
    async getActChannelType() {
      // 渠道类型，B端类型
      var query = {
        // cjType: "0", //"根据所选场景父类判断 场景传-0，重点行业传-1"
        // cjInfoId: this.radio.cjInfoId,
        parentId: "0",
        yjToken: sessionStorage.getItem("yjToken"),
      };
      console.log(query, "12222");
      var encryData = this.getisEncParams(query);
      await this.$http("querySamllRoadshowChannelTypeInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据11");
          if (resData.length) {
            this.routeQuery.actChannelTypeName = resData[0]?.channelTypeName;
            this.routeQuery.actChannelType = resData[0]?.channelTypeId;
          }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
  },
};
</script>
<style lang="less" scoped>
.pages {
  width: 100%;
  min-height: 100%;
  background: #f7f7f7;
  .items {
    padding: 0 20px;
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #f5f5f5;
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
  }

  ::v-deep .van-radio {
    width: 100%;
  }
  ::v-deep .van-cell__title {
    font-weight: bold;
    font-size: 32px;
    color: #393b3f;
  }
}
</style>
