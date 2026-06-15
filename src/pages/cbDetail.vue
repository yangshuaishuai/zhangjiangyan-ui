<template>
  <div class="pages">
    <div class="content">
      <van-field
        class="title"
        label="姓名"
        :value="dataInfo.custName"
        readonly
        placeholder="暂无数据"
        input-align="right"
      ></van-field>
      <van-form>
        <my-field :dataForm="dataForm" :dataInfo="dataInfo" />
        <div class="btns">
          <van-button
            class="btn"
            style="margin-right: 10px"
            color="#5176E0"
            type="info"
            block
            @click="edit"
            >编辑</van-button
          >
          <van-button class="btn" type="danger" block @click="deleteInfo"
            >删除</van-button
          >
        </div>
      </van-form>
    </div>
    <div class="process">
      <div class="processTitle">
        <span class="text">储备变更详情</span>
        <span
          v-if="
            dataInfo.cbStatus != '5' && userInfo.userId == dataInfo.createUserId
          "
          class="btn"
          @click="addProcess"
          >新增</span
        >
      </div>
      <div class="processContent">
        <van-list
          v-model="stepsloading"
          :finished="stepsfinished"
          finished-text="没有更多了"
          @load="onLoadsteps"
          :immediate-check="false"
          offset="50"
        >
          <van-steps direction="vertical" :active="0">
            <van-step v-for="(item, i) in stepList">
              <h3>{{ getVal(item.cbStatus, cbStatusList) }}</h3>
              <div class="stepText">操作人：{{ item.updateUserName }}</div>
              <div class="stepText">修改时间：{{ item.updateTimeValue }}</div>
            </van-step>
          </van-steps>
        </van-list>
      </div>
    </div>
    <!-- 新增信息 -->
    <van-dialog
      v-model="cbStatusShow"
      title="储备信息"
      show-cancel-button
      :before-close="cbStatusbeforeClose"
    >
      <van-form
        class="detail"
        input-align="right"
        :show-error-message="false"
        label-width="40%"
        ref="cbform"
      >
        <van-field
          input-align="right"
          :value="getVal(cbInfo.cbStatus, cbStatusList)"
          is-link
          rows="1"
          autosize
          type="textarea"
          readonly
          name="cbStatus"
          label="储备状态"
          placeholder="请选择储备状态"
          @click="cbStatusShowPopup = true"
          required
          :rules="[{ required: true, message: '请选择储备状态' }]"
        />
        <!-- <van-field
          label="储备金额（万元）"
          v-model="cbInfo.cbMoney"
          name="cbMoney"
          placeholder="请输入储备金额"
          input-align="right"
          type="number"
          required
          :rules="[{ pattern, required: true, message: '请输入储备金额' }]"
        >
        </van-field> -->
      </van-form>
    </van-dialog>
    <!-- 储备状态 -->
    <van-popup v-model="cbStatusShowPopup" position="bottom">
      <van-picker
        show-toolbar
        value-key="dictName"
        :columns="cbStatusList"
        @confirm="
          cbStatusShowPopup = false;
          onConfirm($event, 'cbStatus');
        "
        @cancel="cbStatusShowPopup = false"
      ></van-picker>
    </van-popup>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pattern: /^(\d+(\.\d{1,2})?)$/,
      dataInfo: {},
      dataForm: [
        {
          label: "一级场景",
          key: "cjYjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "二级场景",
          key: "cjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "所属路演",
          key: "actName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "具体B端名称",
          key: "channelBTypeName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "渠道类型",
          key: "actChannelTypeName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "具体B端类型",
          key: "channelTypeName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "网格员姓名",
          key: "wgyName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "网格员手机号",
          key: "wgyPhone",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "网格员机构名称",
          key: "wgyEfInstName",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "网格员职务",
          key: "wgyPost",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "客户手机号",
          key: "custPhone",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "客户类型",
          key: "customerType",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("customerTypeList")),
        },
        {
          label: "获客来源",
          key: "hkSource",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("hkSourceList")),
        },
        {
          label: "一级行业",
          key: "professionYjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "showPicker",
        },
        {
          label: "二级行业",
          key: "professionName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "showPicker",
        },
        {
          label: "二级分行",
          key: "upOrgName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "一级支行",
          key: "orgName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          rows: true,
        },
        {
          label: "网点机构名称",
          key: "efInstName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          rows: true,
        },
        {
          label: "客户经理工号",
          key: "khjlUserId",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "客户经理姓名",
          key: "khjlUserName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "当前状态",
          key: "cbStatus",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("cbStatusList")),
        },
        {
          label: "产品名称",
          key: "productName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("productNameList")),
        },
        {
          label: "预计支用日期",
          key: "yzyData",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "预计支用金额(万元)",
          key: "yzyMoney",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "备注",
          key: "remark",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "测额日期（受理日期）",
          key: "ceDate",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "申请金额(万元)",
          key: "applyMoney",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "报审日期",
          key: "sbDate",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "报审金额(万元)",
          key: "sbMoney",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "获批日期",
          key: "hpDate",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "获批金额(万元)",
          key: "hpMoney",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "调查是否超期",
          key: "dcIsCq",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "radio",
          isRadioDisable: true,
          columns: this.$global.flag,
        },
        {
          label: "放款是否超期",
          key: "fkIsCq",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "radio",
          isRadioDisable: true,
          columns: this.$global.flag,
        },
      ],
      routeQuery: {}, //路由参数
      cbStatusList: JSON.parse(sessionStorage.getItem("cbStatusList")),
      stepList: [], //储备变更流程
      stepsloading: false,
      stepsfinished: false,
      stepspageIndex: 1,
      stepspageSize: 5,
      // 新增储备信息
      cbStatusShow: false,
      cbInfo: {
        cbStatus: "",
        cbMoney: "",
      },
      cbStatusShowPopup: false,
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
    };
  },
  created() {
    sessionStorage.removeItem("dataInfo");
    this.routeQuery = this.$route.query;
    this.getData();
    this.getStepList();
  },
  methods: {
    getData() {
      // 根据id查详情
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        custId: this.routeQuery.custId,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowCustomerById", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          this.dataInfo = Object.assign(this.routeQuery, resData);
          console.log(this.dataInfo, "-------");
          this.setdataFormVal(this.dataInfo, this.dataForm);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    edit() {
      console.log("编辑");
      this.$router.push({
        name: "editCbInfo",
        query: {
          custId: this.dataInfo.custId,
        },
      });
    },
    deleteInfo() {
      this.$dialog
        .confirm({
          title: "确定要删除该客户吗？",
          message: "",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "删除",
        })
        .then(async () => {
          var query = {
            yjToken: sessionStorage.getItem("yjToken"),
            ids: [this.routeQuery.custId],
          };
          console.log(query, "请求参数");
          var encryData = this.getisEncParams(query);
          // 执行删除操作
          await this.$http(`delSamllRoadshowCustomerByIds`, {
            ...encryData.encryQuery,
            isEnc: 1,
          }).then((res) => {
            this.$router.replace({
              name: "submitsuccess",
              query: {
                title: "删除成功！",
              },
            });
          });
        });
    },
    onLoadsteps() {
      if (this.stepList.length > 0) {
        this.stepspageIndex += 1;
        this.getStepList();
      }
    },
    getStepList() {
      // 获取储备变更流程
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        custId: this.routeQuery.custId,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(
        query,
        this.stepspageIndex,
        this.stepspageSize
      );
      this.$http(`querySamllRoadshowCustomerCbInfoByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "获取储备变更流程解密后数据");
          // 判断是否 下一页
          this.stepsloading = false;
          if (this.stepspageIndex * this.stepspageSize >= resData.total) {
            this.stepsfinished = true;
          } else {
            this.stepsfinished = false;
          }
          this.stepList =
            this.stepspageIndex == 1
              ? resData.list
              : this.stepList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    addProcess() {
      // 新增储备信息
      this.cbStatusShow = true;
    },
    cbStatusbeforeClose(action, done) {
      if (action == "cancel") {
        done();
      } else {
        this.$refs.cbform
          .validate()
          .then((res) => {
            this.cbInfo.cbType = "1";
            this.cbInfo.custId = this.dataInfo.custId;
            this.cbInfo.yjToken = sessionStorage.getItem("yjToken");
            // 检验储备金额
            if (this.cbInfo.cbMoney) {
              if (!this.pattern.test(this.cbInfo.cbMoney)) {
                done(false);
                this.$toast("请输入正确的储备金额");
                return;
              }
            }
            var encryData = this.getisEncParams(this.cbInfo);
            this.$http(`saveOrUpdateSamllRoadshowCustomerCbInfo`, {
              ...encryData.encryQuery,
              isEnc: 1,
            })
              .then((res) => {
                done();
                this.getData();
                this.getStepList();
              })
              .catch((err) => {
                done(false);
                console.log(err, "错误");
              });
          })
          .catch((err) => {
            try {
              this.$toast(err[0].message);
            } catch (e) {}
            done(false);
          });
      }
    },
    onConfirm(e, type) {
      console.log(e, type);
      if (type == "cbStatus") {
        this.cbInfo.cbStatus = e.dictId;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pages {
  width: 100%;
  min-height: 100%;
  background: #f7f7f7;
  box-sizing: border-box;
  padding: 20px;
  .content {
    background: #fff;
    .title {
      border-bottom: 1px solid #f5f5f5;
      ::v-deep .van-cell__value {
        font-weight: bold;
        font-size: 30px;
      }
    }
    .btns {
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      padding: 20px;
      display: flex;
      .btn {
        border-radius: 12px;
      }
    }
  }
  .process {
    margin-top: 40px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    max-height: 700px;
    overflow-y: auto;
    .processTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        font-weight: bold;
        font-size: 30px;
        color: #696c77;
        word-break: break-all;
      }
      .btn {
        background: #eef2fc;
        border-radius: 45px;
        color: #5176e0;
        font-size: 30px;
        line-height: 30px;
        padding: 18px 60px;
      }
    }
    .processContent {
      border-top: 1px solid #f5f5f5;
      margin-top: 20px;
      .stepText {
        padding: 10px 10px 0;
      }
    }
  }
}
</style>
