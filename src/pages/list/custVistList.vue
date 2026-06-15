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
      <div class="btns">
        <div class="text">已选择 {{ result.length }} 个客户</div>
        <div class="btn" @click="gotoAddCust">
          <img src="../../assets/img/addIcon.png" alt="" />
          <span>新建</span>
        </div>
      </div>
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
                <span class="title"
                  >{{ item.custName }}({{
                    getVal(item.custBelongTiaoxian, custBelongTiaoxianList)
                  }})</span
                >
                <span class="text">联系方式：{{ item.custPhone }}</span>
              </div>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
      <!-- 多选 -->
      <van-checkbox-group v-model="result" v-if="type == 'checkbox'">
        <div class="radioItem" v-for="(item, index) in dataLists" :key="index">
          <van-checkbox :name="item.custId" shape="square">
            <div class="list-item">
              <div class="left">
                <span class="title"
                  >{{ item.custName }}({{
                    getVal(item.custBelongTiaoxian, custBelongTiaoxianList)
                  }})</span
                >
                <span class="text">联系方式：{{ item.custPhone }}</span>
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
      custList: [],
      dataInfo: {},
      custBelongTiaoxianList: JSON.parse(
        sessionStorage.getItem("custBelongTiaoxianList")
      ), //客户条线
    };
  },
  async created() {
    this.routeQuery = JSON.parse(sessionStorage.getItem("dataInfo"));
    this.name = this.$route.query.name;
    this.type = this.$route.query.type;
    console.log(this.name, "**name**");

    if (this.routeQuery?.custList?.length) {
      this.custList = this.routeQuery.custList;
    }
    if (this.routeQuery?.result?.length) {
      this.result = this.routeQuery.result;
    }
    await this.getList();
  },
  methods: {
    gotoAddCust() {
      console.log("编辑");
      var relateCustInfo = {
        channelBTypeName: this.routeQuery.channelBTypeName,
        channelId: this.routeQuery.channelId,
      };
      sessionStorage.setItem("relateCustInfo", JSON.stringify(relateCustInfo));

      this.$router.push({
        name: "editCustInfo",
        query: {
          fromPath: "custVistList",
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
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http(`querySamllRoadshowCustomerByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then(async (res) => {
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
    findAllCommonById(arrA, arrB) {
      const isSet = new Set(arrB.map((item) => item));
      return arrA.filter((item) => isSet.has(item.custId));
    },
    unionById(arrA, arrB) {
      const merged = [...arrA, ...arrB];
      return merged.reduce((acc, current) => {
        const exists = acc.some((item) => item.custId === current.custId);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
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
      console.log("this.result", this.result);
      // return;
      if (this.type == "radio") {
        // 单选
        if (!this.radio) {
          this.$toast("请选择客户");
          return;
        }
        this.routeQuery.custName = this.radio.custName;
        this.routeQuery.custId = this.radio.custId;
        this.$router.replace({
          name: this.name,
          query: this.routeQuery,
        });
      } else if (this.type == "checkbox") {
        // 多选
        if (!this.result.length) {
          this.$toast("请选择客户");
          return;
        }
        var arr = [];
        var pramaCustList = [];
        // 先取并集，然后取选中的id.遍历总的数组
        const submitData = this.unionById(this.dataLists, this.custList);
        const submitArr = this.findAllCommonById(submitData, this.result);
        submitArr.map((item, i) => {
          pramaCustList.push(item);
        });

        const newDataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
        sessionStorage.setItem(
          "dataInfo",
          JSON.stringify({
            ...newDataInfo,
            custList: pramaCustList,
            result: this.result,
          })
        );
        this.$router.replace({
          name: this.name,
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
      .text {
        padding: 20px 16px;
        font-size: 28px;
        color: #99a0af;
      }
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