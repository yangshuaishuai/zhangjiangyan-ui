<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="keyWord"
        placeholder="请输入路演名称"
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
                <span class="title">{{ item.actName }}</span>
                <div class="text">
                  <div>日期：{{ item.actDate }}</div>
                  <div class="text">
                    地点：{{ item.actCounties }} {{ item.actStreet }}
                  </div>
                </div>
              </div>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
      <!-- 多选 -->
      <van-checkbox-group
        ref="checkbox"
        v-model="result"
        v-if="type == 'checkbox'"
      >
        <div class="radioItem" v-for="(item, index) in dataLists" :key="index">
          <van-checkbox
            :name="item.actInfoId"
            shape="square"
            :key="item.actInfoId"
          >
            <div class="list-item">
              <div class="left">
                <span class="title">{{ item.actName }}</span>
                <div class="text">
                  <div>日期：{{ item.actDate }}</div>
                  <div class="text">
                    地点：{{ item.actCounties }} {{ item.actStreet }}
                  </div>
                </div>
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
      result: [], //多选框选中的id
      selectList: [], //选中的选项
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
    if (this.fromPath == "custVistList") {
      dataInfo = JSON.parse(sessionStorage.getItem("relateCustInfo"));
    } else {
      if (this.name == "addChannelVisit") {
        dataInfo = JSON.parse(sessionStorage.getItem("qddataInfo"));
      } else if (this.name == "addCustVisit") {
        dataInfo = JSON.parse(sessionStorage.getItem("khdataInfo"));
      } else {
        dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      }
    }
    this.routeQuery = dataInfo;
    this.type = this.$route.query.type;
    console.log(this.routeQuery, "路由参数");
    if (this.routeQuery.samllRsActChannelRelVos?.length) {
      this.routeQuery.samllRsActChannelRelVos.map((item) => {
        this.result.push(item.actInfoId);
      });
      this.selectList = this.routeQuery.samllRsActChannelRelVos;
    }
    console.log(this.result, "****");
    this.getList();
  },
  methods: {
    async getList() {
      var query;
      query = {
        yjToken: sessionStorage.getItem("yjToken"),
        isDraft: "0",
        keyWord: this.keyWord,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http(`querySamllRoadshowActInfoByPage`, {
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
          resData.list.map((item) => {
            this.result.map((i) => {
              if (item.actInfoId == i) {
                item.checked = true;
              }
            });
          });
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
          this.$toast("请选择所属路演");
          return;
        }
        this.routeQuery.actName = this.radio.actName;
        this.routeQuery.actInfoId = this.radio.actInfoId;
        // this.routeQuery.orgId = this.radio.orgId;
        // this.routeQuery.orgName = this.radio.orgName;
        // this.routeQuery.upOrgId = this.radio.upOrgId;
        // this.routeQuery.upOrgName = this.radio.upOrgName;
      } else if (this.type == "checkbox") {
        // 多选
        if (!this.result.length) {
          this.$toast("请选择所属路演");
          return;
        }
        var arr = [];
        var actNames = "";
        var pramaCustList = [];
        // 先取并集，然后取选中的id.遍历总的数组
        const submitData = this.unionById(this.dataLists, this.selectList);
        const submitArr = this.findAllCommonById(submitData, this.result);
        submitArr.map((item, i) => {
          pramaCustList.push(item);
        });
        pramaCustList.map((item, i) => {
          arr.push({
            actInfoId: item.actInfoId,
            orgId: item.orgId,
            orgName: item.orgName,
            upOrgId: item.upOrgId,
            upOrgName: item.upOrgName,
            actName: item.actName,
          });
          if (i == pramaCustList.length - 1) {
            actNames += item.actName;
          } else {
            actNames += item.actName + ",";
          }
        });
        console.log(arr, "---");
        this.routeQuery.samllRsActChannelRelVos = arr;
        this.routeQuery.actNames = actNames;
      }
      if (this.fromPath == "custVistList") {
        sessionStorage.setItem(
          "relateCustInfo",
          JSON.stringify(this.routeQuery)
        );
      } else {
        if (this.name == "addChannelVisit") {
          sessionStorage.setItem("qddataInfo", JSON.stringify(this.routeQuery));
        } else if (this.name == "addCustVisit") {
          sessionStorage.setItem("khdataInfo", JSON.stringify(this.routeQuery));
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
    },
    findAllCommonById(arrA, arrB) {
      const isSet = new Set(arrB.map((item) => item));
      return arrA.filter((item) => isSet.has(item.actInfoId));
    },
    unionById(arrA, arrB) {
      const merged = [...arrA, ...arrB];
      return merged.reduce((acc, current) => {
        const exists = acc.some((item) => item.actInfoId === current.actInfoId);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
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
