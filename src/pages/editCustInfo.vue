<template>
  <div class="pages">
    <van-form
      @submit="onSubmit"
      @failed="failed"
      :show-error-message="false"
      ref="form"
      label-width="40%"
      input-align="right"
    >
      <my-field
        :dataForm="dataForm"
        :dataInfo="dataInfo"
        @showPicker="(item, i) => showPickerFun(item, i)"
        @input="(item, i) => inputFun(item, i)"
        @focus="(item, i) => focusFun(item, i)"
        @blur="(item, i) => blurFun(item, i)"
        @change="(item, i) => changeFun(item, i)"
      />
      <!-- 获客来源 -->
      <van-popup v-model="hkSourceShowPopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="dictName"
          :columns="hkSourceList"
          @confirm="
            hkSourceShowPopup = false;
            onConfirm($event, 'hkSource');
          "
          @cancel="hkSourceShowPopup = false"
        ></van-picker>
      </van-popup>
      <!-- 一级细分行业 -->
      <van-popup v-model="xfHyYjShowPopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="professionName"
          :columns="xfHyYjList"
          @confirm="
            xfHyYjShowPopup = false;
            onConfirm($event, 'professionYjName');
          "
          @cancel="xfHyYjShowPopup = false"
        ></van-picker>
      </van-popup>
      <!-- 细分行业 -->
      <van-popup v-model="xfHyShowPopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="professionName"
          :columns="xfHyList"
          @confirm="
            xfHyShowPopup = false;
            onConfirm($event, 'professionName');
          "
          @cancel="xfHyShowPopup = false"
        ></van-picker>
      </van-popup>
      <!-- 客户属性 -->
      <van-popup v-model="custSxShowPopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="dictName"
          :columns="custSxList"
          @confirm="
            custSxShowPopup = false;
            onConfirm($event, 'custSx');
          "
          @cancel="custSxShowPopup = false"
        ></van-picker>
      </van-popup>
      <!-- 客户类型 -->
      <van-popup v-model="customerTypePopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="dictName"
          :columns="customerTypeList"
          @confirm="
            customerTypePopup = false;
            onConfirm($event, 'customerType');
          "
          @cancel="customerTypePopup = false"
        ></van-picker>
      </van-popup>
      <!-- 一级支行 -->
      <van-popup v-model="orgNamePopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="instName"
          :columns="orgNameList"
          @confirm="
            orgNamePopup = false;
            onwgyConfirm($event, 'orgName');
          "
          @cancel="orgNamePopup = false"
        ></van-picker>
      </van-popup>
      <!-- 二级支行 -->
      <van-popup v-model="ezOrgNamePopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="instName"
          :columns="ezOrgNameList"
          @confirm="
            ezOrgNamePopup = false;
            onwgyConfirm($event, 'ezOrgName');
          "
          @cancel="ezOrgNamePopup = false"
        ></van-picker>
      </van-popup>
      <!-- 其他市分行 -->
      <van-popup v-model="thInstIdPopup" position="bottom">
        <van-picker
          show-toolbar
          value-key="dictName"
          :columns="thInstIdList"
          @confirm="
            thInstIdPopup = false;
            onConfirm($event, 'thInstId');
          "
          @cancel="thInstIdPopup = false"
        ></van-picker>
      </van-popup>
    </van-form>
    <div style="height: 100px"></div>
    <div class="footer">
      <div class="btns" v-if="dataInfo.isDraft == 0">
        <van-button
          class="btn"
          native-type="button"
          type="info"
          block
          @click="finalSubmit"
          color="#5176E0"
          >提交</van-button
        >
      </div>
      <button-group
        v-else
        @finalSubmit="finalSubmit"
        @staging="staging"
        text1="暂存"
      ></button-group>
    </div>
  </div>
</template>
<script>
var strreg = /^(?!.*(.)\d{6,})(.*)$/;
export default {
  data() {
    return {
      reg: /^(\d+(\.\d{1,2})?)$/,
      dataForm: [
        {
          label: "姓名",
          key: "custName",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入姓名" }],
          error: false,
        },
        {
          label: "一级场景",
          key: "cjYjName",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请选择一级场景" }],
          error: false,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "二级场景",
          key: "cjName",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请选择二级场景" }],
          error: false,
          rows: true,
          type: "showPicker",
        },
        {
          label: "所属路演",
          key: "actName",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: false, message: "请选择所属路演" }],
          error: false,
          rows: true,
        },
        {
          label: "具体B端名称",
          key: "channelBTypeName",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: true, message: "请选择所属渠道" }],
          error: false,
          rows: true,
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
          rows: true,
          val: "",
          readonly: true,
          type: "showPicker",
        },
        {
          label: "网格员手机号",
          key: "wgyPhone",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
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
          label: "获客来源",
          key: "hkSource",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          rules: [{ required: true, message: "请选择获客来源" }],
          error: false,
          rows: true,
          columns: JSON.parse(sessionStorage.getItem("hkSourceList")),
        },
        {
          label: "一级行业",
          key: "professionYjName",
          rows: true,
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: true, message: "请选择一级行业" }],
          error: false,
          rows: true,
        },
        {
          label: "二级行业",
          key: "professionName",
          rows: true,
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: true, message: "请选择二级行业" }],
          error: false,
          rows: true,
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
          type: "showPicker",
          rules: [{ required: false, message: "请选择一级支行" }],
          rows: true,
        },
        {
          label: "二级支行",
          key: "ezOrgName",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: false, message: "请选择二级支行" }],
          rows: true,
        },
        {
          label: "客户属性",
          key: "custSx",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          rules: [{ required: true, message: "请选择客户属性" }],
          error: false,
          rows: true,
          columns: JSON.parse(sessionStorage.getItem("custSxList")),
        },
        {
          label: "客户类型",
          key: "customerType",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          rules: [{ required: true, message: "请选择客户类型" }],
          error: false,
          rows: true,
          columns: JSON.parse(sessionStorage.getItem("customerTypeList")),
        },
        {
          label: "联系方式",
          key: "custPhone",
          rows: true,
          val: "",
          readonly: false,
          rules: [
            {
              validator: this.isDesPhone,
              required: true,
              message: "请输入联系方式",
            },
          ],
          error: false,
          inputType: "tel",
          maxlength: "11",
        },
        {
          label: "企业名称",
          key: "qyName",
          rows: true,
          val: "",
          readonly: false,
          rules: [
            {
              required: false,
              pattern: strreg,
              message: "请输入企业名称（不能包含手机号）",
            },
          ],
        },
        {
          required: true,
          label: "是否归属其他地市",
          key: "isSyTh",
          val: "0",
          readonly: false,
          rules: [{ required: true, message: "请选择是否归属其他地市" }],
          type: "radio",
          columns: this.$global.isSyTh,
          error: false,
        },
        {
          label: "其他市分行",
          key: "thInstId",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          rules: [{ required: true, message: "请选择其他市分行" }],
          error: false,
          rows: true,
          columns: JSON.parse(sessionStorage.getItem("thInstIdList")),
          parentKey: "isSyTh",
        },
      ],
      dataInfo: {
        actInfoId: "",
        cjInfoId: "",
        channelId: "",
        actName: "",
        channelBTypeName: "",
        custName: "",
        custPhone: "",
        isSyTh: "0",
        thInstId: "",
      },
      hkSourceShowPopup: false, //获客来源弹框
      hkSourceList: JSON.parse(sessionStorage.getItem("hkSourceList")), //获客来源
      xfHyShowPopup: false, //细分行业弹框
      xfHyList: [], //细分行业
      xfHyYjShowPopup: false, //一级细分行业
      xfHyYjList: [], //一级细分行业
      custSxShowPopup: false, //客户属性弹框
      customerTypePopup: false, //客户类型弹框
      orgNamePopup: false, //一级支行
      orgNameList: [],
      ezOrgNamePopup: false, //二级支行
      ezOrgNameList: [],
      custSxList: JSON.parse(sessionStorage.getItem("custSxList")), //客户属性
      customerTypeList: JSON.parse(sessionStorage.getItem("customerTypeList")), //客户类型
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")), //当前登录人信息
      thInstIdPopup: false, //其他市分行
      thInstIdList: JSON.parse(sessionStorage.getItem("thInstIdList")), //其他市分行
    };
  },
  created() {
    var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    this.dataInfo = Object.assign(this.dataInfo, dataInfo);
    // 获取当前登录人机构信息
    if (this.userInfo.ezOrgId) {
      this.dataInfo.ezOrgId = this.userInfo.ezOrgId;
      this.dataInfo.ezOrgName = this.userInfo.ezOrgName;
    }
    if (this.userInfo.orgId) {
      this.dataInfo.orgId = this.userInfo.orgId;
      this.dataInfo.orgName = this.userInfo.orgName;
    }
    if (this.userInfo.upOrgId) {
      this.dataInfo.upOrgId = this.userInfo.upOrgId;
      this.dataInfo.upOrgName = this.userInfo.upOrgName;
    }
    if (!this.userInfo.orgId) {
      this.getorgInfo(this.dataInfo.upOrgId); //一级支行数据
    }
    if (!this.userInfo.ezOrgId && this.dataInfo.orgId) {
      this.getwgyOrgInfo(this.dataInfo.orgId); //二级支行数据
    }
    this.setdataFormVal(this.dataInfo, this.dataForm);
    console.log(this.dataInfo, "**----**");
    this.getXfHyList("0");
    if (this.dataInfo.xfHyYj) {
      this.getXfHyList("1", this.dataInfo.xfHyYj);
    }
  },
  methods: {
    finalSubmit() {
      this.$refs.form.submit();
    },
    staging() {
      var values = this.$refs.form.getValues();
      var query = Object.assign(this.dataInfo, values);
      this.setCodeValues(query, this.dataForm);
      query.yjToken = sessionStorage.getItem("yjToken");
      query.isDraft = "1";
      if (query.channelWgyId) {
        // 1代表有网格员  0代表无网格员
        query.channelWgyIdFz = "1";
      } else {
        query.channelWgyIdFz = "0";
      }
      if (query.ezOrgId) {
        query.gsInstId = query.ezOrgId;
        query.gsInstName = query.ezOrgName;
      } else if (query.orgId) {
        query.gsInstId = query.orgId;
        query.gsInstName = query.orgName;
      } else if (query.upOrgId) {
        query.gsInstId = query.upOrgId;
        query.gsInstName = query.upOrgName;
      }
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("saveOrUpdateSamllRoadshowCustomer", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          this.$router.replace({ name: "submitsuccess" });
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onSubmit(values) {
      var values = this.$refs.form.getValues();
      var query = Object.assign(this.dataInfo, values);
      console.log(query, "---");
      this.setCodeValues(query, this.dataForm);
      query.yjToken = sessionStorage.getItem("yjToken");
      query.isDraft = "0";
      if (query.channelWgyId) {
        // 1代表有网格员  0代表无网格员
        query.channelWgyIdFz = "1";
      } else {
        query.channelWgyIdFz = "0";
      }
      if (query.ezOrgId) {
        query.gsInstId = query.ezOrgId;
        query.gsInstName = query.ezOrgName;
      } else if (query.orgId) {
        query.gsInstId = query.orgId;
        query.gsInstName = query.orgName;
      } else if (query.upOrgId) {
        query.gsInstId = query.upOrgId;
        query.gsInstName = query.upOrgName;
      }
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("saveOrUpdateSamllRoadshowCustomer", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          this.$router.replace({ name: "submitsuccess" });
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    showPickerFun(item, i) {
      var values = this.$refs.form.getValues();
      var query = Object.assign(this.dataInfo, values);
      sessionStorage.setItem("dataInfo", JSON.stringify(query));
      if (item.key == "cjName") {
        console.log("跳转所属场景");
        this.$router.push({
          name: "home",
          query: {
            name: "editCustInfo",
          },
        });
      } else if (item.key == "actName") {
        console.log("跳转所属路演页面");
        this.$router.push({
          name: "activeList",
          query: {
            name: "editCustInfo",
            type: "radio",
          },
        });
      } else if (item.key == "channelBTypeName") {
        console.log("跳转所属渠道页面");
        this.$router.push({
          name: "channelList",
          query: {
            name: "editCustInfo",
            type: "radio",
          },
        });
      } else if (item.key == "wgyName") {
        console.log("跳转网格员选择");
        if (!query.channelBTypeName) {
          this.$toast("请先选择所属渠道");
          return;
        }
        this.$router.push({
          name: "wgyList",
          query: {
            name: "editCustInfo",
          },
        });
      } else if (item.key == "hkSource") {
        this.hkSourceShowPopup = true;
      } else if (item.key == "professionYjName") {
        this.xfHyYjShowPopup = true;
      } else if (item.key == "professionName") {
        // if (!this.dataInfo.cjInfoId) {
        //   this.$toast("请先选择所属场景");
        // } else {
        //   this.xfHyShowPopup = true;
        // }
        if (!values.professionYjName) {
          this.$toast("请先选择一级细分行业");
          return;
        }
        this.xfHyShowPopup = true;
      } else if (item.key == "custSx") {
        this.custSxShowPopup = true;
      } else if (item.key == "customerType") {
        this.customerTypePopup = true;
      } else if (item.key == "orgName" && !this.userInfo.orgId) {
        this.orgNamePopup = true;
      } else if (item.key == "ezOrgName" && !this.userInfo.ezOrgId) {
        if (!values.orgName) {
          this.$toast("请先选择一级支行");
          return;
        }
        this.ezOrgNamePopup = true;
      } else if (item.key == "thInstId") {
        this.thInstIdPopup = true;
      }
    },
    inputFun(item, i) {},
    focusFun(item, i) {
      item.error = false;
    },
    blurFun(item, i) {},
    changeFun(item, i) {
      if (item.key == "isSyTh" && item.val == "0") {
        // 是否归属其他地市为否时，其他市分行为空
        this.dataForm.some((item) => {
          if (item.key == "thInstId") {
            item.val = "";
            this.dataInfo.thInstId = "";
          }
        });
      }
    },
    failed(e) {
      console.log(e, "---");
      this.dataForm.map((item, index) => {
        this.dataForm[index].error = false;
        e.errors.map((itm) => {
          if (itm.name == item.key) {
            this.dataForm[index].error = true;
          }
        });
      });
      if (e.errors.length) {
        this.$toast(e.errors[0].message);
      }
    },
    onConfirm(e, type) {
      this.dataForm.map((item) => {
        if (item.key == type && type == "hkSource") {
          item.val = e.dictName;
        } else if (item.key == type && type == "professionName") {
          item.val = e.professionName;
          this.dataInfo.xfHy = e.professionInfoId;
        } else if (item.key == type && type == "professionYjName") {
          item.val = e.professionName;
          this.dataInfo.xfHyYj = e.professionInfoId;
          this.getXfHyList("1", this.dataInfo.xfHyYj);
        } else if (item.key == type && type == "custSx") {
          item.val = e.dictName;
        } else if (item.key == type && type == "customerType") {
          item.val = e.dictName;
        } else if (item.key == type && type == "thInstId") {
          item.val = e.dictName;
        }
        // 级联选择
        if (type == "professionYjName" && item.key == "professionName") {
          item.val = "";
          this.dataInfo.xfHy = "";
        }
      });
    },
    // 获取网点
    onwgyConfirm(e, type) {
      console.log(e, "---");
      this.dataForm.some((item, index) => {
        if (item.key == type && (type == "ezOrgName" || type == "orgName")) {
          item.val = e.instName;
        }
        if (type == "orgName" && item.key == "ezOrgName") {
          item.val = "";
        }
      });
      if (type == "ezOrgName") {
        this.dataInfo.ezOrgId = e.instId;
        this.dataInfo.ezOrgName = e.instName;
      } else if (type == "orgName") {
        this.dataInfo.orgId = e.instId;
        this.dataInfo.orgName = e.instName;
        this.getwgyOrgInfo(this.dataInfo.orgId);
      }
    },
    // 一级支行
    async getorgInfo(upInstId) {
      var query = {
        upInstId,
        yjToken: sessionStorage.getItem("yjToken"),
      };
      console.log("获取一级支行列表参数", query);
      var encryData = this.getisEncParams(query);
      await this.$http("queryYzInfoByEf", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "获取一级支行列表解密后数据");
          this.orgNameList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    // 获取网点列表
    async getwgyOrgInfo(upInstId) {
      var query = {
        upInstId,
        yjToken: sessionStorage.getItem("yjToken"),
      };
      console.log("获取网点列表参数", query);
      var encryData = this.getisEncParams(query);
      await this.$http("queryWdxInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "获取网点列表解密后数据");
          this.ezOrgNameList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    async getXfHyList(isYj, parentId) {
      // 获取细分行业
      var parentCjName;
      if (this.dataInfo.cjName) {
        parentCjName = this.dataInfo.cjName.split("-")[1];
      }
      var query = {
        // hangYeType: "", //"0-涉农公贷GBC联动/小企业链式开发  1-其他"
        // cjName: parentCjName,
        yjToken: sessionStorage.getItem("yjToken"),
        isYj,
        parentId,
      };
      // if (
      //   parentCjName == "涉农公贷GBC联动" ||
      //   parentCjName == "小企业链式开发"
      // ) {
      //   query.hangYeType = "0";
      // } else {
      //   query.hangYeType = "1";
      // }
      console.log(query, "获取细分行业参数");
      var encryData = this.getisEncParams(query);
      await this.$http("queryHangYeInfoByEjInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "获取细分行业解密后数据");
          if (isYj == "0") {
            this.xfHyYjList = resData;
          } else {
            this.xfHyList = resData;
          }
          //   if (query.hangYeType == "1") {
          //     this.dataInfo.professionName = resData[0].professionName;
          //     this.dataInfo.xfHy = resData[0].professionInfoId;
          //     this.setdataFormVal(this.dataInfo, this.dataForm);
          //   }
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
  box-sizing: border-box;
  .van-form {
    padding: 20px;
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
