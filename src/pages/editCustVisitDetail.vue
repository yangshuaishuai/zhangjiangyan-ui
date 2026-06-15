<template>
  <div class="pages">
    <div class="title">客户基本信息</div>
    <div class="basic-info">
      <my-field :dataForm="basicForm" :dataInfo="dataInfo" />
    </div>
    <div class="title">客户走访登记</div>
    <div class="basic-info">
      <van-form
        @submit="onSubmit"
        @failed="failed"
        :show-error-message="false"
        ref="form"
        label-width="40%"
        input-align="right"
      >
        <van-field
          input-align="right"
          required
          :value="getVal(dataInfo.interviewType, custInterviewTypeList)"
          is-link
          rows="1"
          autosize
          type="textarea"
          readonly
          name="interviewType"
          label="走访人员类型"
          placeholder="请选择走访人员类型"
          @click="interviewTypePicker = true"
          :rules="[{ required: true, message: '请选择走访人员类型' }]"
        />
        <van-field
          input-align="right"
          required
          :value="dataInfo.interviewDate"
          is-link
          readonly
          name="recallTime"
          label="走访日期"
          placeholder="请选择走访日期"
          @click="showCalendar = true"
          :rules="[{ required: true, message: '请选择走访日期' }]"
        />
        <van-field
          :required="false"
          input-align="right"
          v-model="dataInfo.cubeiMoney"
          name="cubeiMoney"
          placeholder="请输入储备业务金额"
          label="储备业务金额"
          :rules="[{ required: false, message: '请输入储备业务金额' }]"
        >
          <template #button>
            <span>万元</span>
          </template>
        </van-field>
        <!-- 走访人员类型多选 -->
        <van-popup v-model="interviewTypePicker" position="bottom">
          <div class="van-picker__toolbar">
            <button
              type="button"
              class="van-picker__cancel"
              @click="interviewTypePicker = false"
            >
              取消
            </button>
            <button
              type="button"
              class="van-picker__confirm"
              @click="interviewTypeConfirm()"
            >
              确认
            </button>
          </div>
          <div style="max-height: 264px; overflow-y: auto">
            <van-checkbox-group
              class="checkboxGroup"
              ref="checkboxGroup"
              v-model="interviewTypecheckboxValue"
            >
              <van-cell-group>
                <van-cell
                  v-for="(item, index) in custInterviewTypeList"
                  :key="item.dictId"
                  :title="item.dictName"
                  clickable
                  @click="channeltoggle(index)"
                >
                  <template #right-icon>
                    <div>
                      <van-checkbox
                        shape="square"
                        ref="checkboxes"
                        :name="item.dictId"
                      />
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </div>
        </van-popup>
        <!-- 路演召开日期 -->
        <van-calendar
          v-model="showCalendar"
          color="#5176E0"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="
            showCalendar = false;
            onConfirm($event);
          "
        />
      </van-form>
    </div>
    <div style="height: 100px"></div>
    <div class="footer">
      <button-group
        @finalSubmit="finalSubmit"
        @staging="goback()"
      ></button-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reg: /^(\d+(\.\d{1,2})?)$/,
      dataInfo: {
        interviewType: "",
        interviewDate: "",
        cubeiMoney: "",
      }, //信息
      activeForm: [
        {
          label: "二级分行",
          key: "upOrgName",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "一级支行",
          key: "orgName",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "路演名称",
          key: "actName",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "路演召开日期",
          key: "actDate",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
      ], //路演表单
      basicForm: [
        {
          label: "客户姓名",
          key: "custName",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "客户证件号码",
          key: "custIdcard",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          label: "客户联系方式",
          key: "custPhone",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "客户所属条线",
          key: "custBelongTiaoxian",
          rows: true,
          val: "",
          readonly: true,
          type: "radio",
          columns: JSON.parse(sessionStorage.getItem("custBelongTiaoxianList")),
          columnsConfig: {
            value: "dictId",
            text: "dictName",
          },
          isRadioDisable: true,
          typeText: "暂无数据",
        },
      ], //客户基本信息表单
      //走访情况表单
      interviewTypePicker: false, //走访人员类型弹框
      custInterviewTypeList: JSON.parse(
        sessionStorage.getItem("custInterviewTypeList")
      ), //客户走访类型选项
      interviewTypecheckboxValue: [], //多选选中的值
      showCalendar: false, //日期弹框
      routeQuery: {}, //路由参数
      minDate: null, //最小日期
      maxDate: null, //最大日期
    };
  },
  created() {
    this.minDate = this.getDateM(15, 15).minDate;
    this.maxDate = this.getDateM(15, 15).maxDate;
    // 转换走访人员类型
    if (sessionStorage.getItem("dataInfo")) {
      const dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      this.dataInfo = {
        ...dataInfo,
      };
      this.setdataFormVal(this.dataInfo, this.activeForm);
      this.setdataFormVal(this.dataInfo, this.basicForm);
    }
  },
  methods: {
    interviewTypeConfirm() {
      this.interviewTypePicker = false;
      this.dataInfo.interviewType = this.interviewTypecheckboxValue.join(",");
    },
    channeltoggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
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
          var data = Object.assign(this.routeQuery, resData);
          this.dataInfo = {
            ...data,
            cubeiMoney: "",
            interviewDate: "",
            interviewType: "",
          };
          console.log(this.dataInfo, "-------");
          this.setdataFormVal(this.dataInfo, this.activeForm);
          this.setdataFormVal(this.dataInfo, this.basicForm);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onConfirm(e) {
      this.dataInfo.interviewDate = this.formatDate(e);
    },
    finalSubmit() {
      this.$refs.form.submit();
    },
    onSubmit() {
      console.log(this.dataInfo, "----");
      if (this.dataInfo.cubeiMoney) {
        if (!this.reg.test(this.dataInfo.cubeiMoney)) {
          this.$toast("请输入正确的储备业务金额");
          return;
        }
      }
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        // 反显数据
        interviewId: this.dataInfo.interviewId,
        isDraft: "0",
        // 新增数据
        cubeiMoney: this.dataInfo.cubeiMoney,
        interviewDate: this.dataInfo.interviewDate,
        interviewType: this.dataInfo.interviewType,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("saveOrUpdateSamllRoadshowCustomerInterview", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          this.$router.replace({ name: "submitsuccess" });
        })
        .catch(() => {
          console.log("请求失败");
        });
    },
    failed(e) {
      if (e.errors.length) {
        this.$toast(e.errors[0].message);
      }
    },
    goback() {
      this.$router.go(-1);
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
  .title {
    font-weight: bold;
    font-size: 30px;
    padding: 20px 20px 0;
  }
  .basic-info {
    padding: 20px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
}
</style>