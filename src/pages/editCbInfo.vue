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
      />
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
    </van-form>
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
    <!-- 产品名称 -->
    <van-popup v-model="productNameShowPopup" position="bottom">
      <van-picker
        show-toolbar
        value-key="dictName"
        :columns="productNameList"
        @confirm="
          productNameShowPopup = false;
          onConfirm($event, 'productName');
        "
        @cancel="productNameShowPopup = false"
      ></van-picker>
    </van-popup>
    <!-- 预支用日期 -->
    <van-calendar
      v-model="showCalendar"
      color="#5176E0"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="
        showCalendar = false;
        onConfirm($event, 'yzyData');
      "
    />
    <!-- 网点 -->
    <van-popup v-model="efInstNamePopup" position="bottom">
      <van-picker
        show-toolbar
        value-key="instName"
        :columns="efInstNameList"
        @confirm="
          efInstNamePopup = false;
          onwgyConfirm($event, 'efInstName');
        "
        @cancel="efInstNamePopup = false"
      ></van-picker>
    </van-popup>
    <!-- 测额情况日期弹框 -->
    <van-popup v-model="showceCalendar" position="bottom">
      <van-datetime-picker
        v-model="dateLssueVal"
        :max-date="MaxDate"
        :min-date="MinDate"
        type="date"
        title="选择年月日"
        @confirm="
          showceCalendar = false;
          onConfirm($event, ceDateType);
        "
      >
      </van-datetime-picker>
    </van-popup>
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
var pattern = /^(\d+(\.\d{1,2})?)$/;
var patternNo = /^(?:\s*|\d+(\.\d{1,2})?)$/; //空字符或小数点两位内
var strreg = /^(?!.*(.)\d{6,})(.*)$/;
export default {
  data() {
    return {
      reg: /^(\d+(\.\d{1,2})?)$/,
      dataForm: [
        {
          label: "客户姓名",
          key: "custName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
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
          typeText: "暂无数据",
          rows: true,
        },
        {
          label: "网点机构名称",
          key: "efInstName",
          val: "",
          readonly: true,
          type: "showPicker",
          rows: true,
          rules: [{ required: true, message: "请选择网点机构名称" }],
        },
        {
          label: "客户经理工号",
          key: "khjlUserId",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入客户经理工号" }],
        },
        {
          label: "客户经理姓名",
          key: "khjlUserName",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入客户经理姓名" }],
        },
        {
          label: "当前状态",
          key: "cbStatus",
          val: "",
          readonly: true,
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("cbStatusList")),
          isDisabled: "cbStatus",
        },
        {
          label: "产品名称",
          key: "productName",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("productNameList")),
        },
        {
          label: "预计支用日期",
          key: "yzyData",
          rows: true,
          val: "",
          readonly: true,
          type: "dateTime",
          rules: [{ required: true, message: "请选择预支用日期" }],
        },
        {
          label: "预计支用金额(万元)",
          key: "yzyMoney",
          rows: true,
          val: "",
          readonly: false,
          rules: [
            { pattern, required: true, message: "请正确输入预计支用金额" },
          ],
        },
        // isDisabled: "cbStatus",
        {
          label: "备注（经营情况、资产负债情况、淡旺季情况等）",
          key: "remark",
          rows: true,
          val: "",
          readonly: false,
          rules: [
            {
              required: false,
              pattern: strreg,
              message: "备注信息不能包含手机号",
            },
          ],
        },
      ],
      dataInfo: {
        actInfoId: "",
        cjInfoId: "",
        channelId: "",
        actName: "",
        channelBTypeName: "",
        custName: "",
        custIdcard: "",
        custPhone: "",
        cbStatus: "",
        cbMoney: "",
        oldcbStatus: "",
        oldcbMoney: "",
        professionName: "",
      },
      oldcbStatus: "", //初始储备状态
      oldcbMoney: "", //初始储备金额
      cbStatusShowPopup: false, //储备状态弹框
      cbStatusList: JSON.parse(sessionStorage.getItem("cbStatusList")), //储备状态
      showCalendar: false, //预支用日期弹框
      minDate: null, //最小日期
      maxDate: null, //最大日期
      customerTypePopup: false, //客户类型弹框
      customerTypeList: JSON.parse(sessionStorage.getItem("customerTypeList")), //客户类型
      hkSourceShowPopup: false, //获客来源弹框
      hkSourceList: JSON.parse(sessionStorage.getItem("hkSourceList")), //获客来源
      xfHyShowPopup: false, //细分行业弹框
      xfHyList: [], //细分行业
      xfHyYjShowPopup: false, //一级细分行业
      xfHyYjList: [], //一级细分行业
      productNameShowPopup: false, //产品名称弹框
      productNameList: JSON.parse(sessionStorage.getItem("productNameList")), //产品名称
      efInstNamePopup: false, //网格员网点弹框
      efInstNameList: [], //网格员网点
      routeQuery: {},
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")), //当前登录人信息
      ceDateType: "", //测额日期类型
      showceCalendar: false, //测额日期弹框
      dateLssueVal: new Date(),
      MinDate: new Date(1900, 0, 1),
      MaxDate: new Date(2100, 0, 1),
    };
  },
  created() {
    this.minDate = this.getDateM(15, 15).minDate;
    this.maxDate = this.getDateM(15, 15).maxDate;
    this.routeQuery = this.$route.query;
    var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    if (dataInfo) {
      this.dataInfo = Object.assign(this.dataInfo, dataInfo);
      this.oldcbStatus = this.dataInfo.oldcbStatus;
      this.oldcbMoney = this.dataInfo.oldcbMoney;
      if (this.dataInfo.ezOrgId && !this.dataInfo.efInstId) {
        this.dataInfo.efInstId = this.dataInfo.ezOrgId;
        this.dataInfo.efInstName = this.dataInfo.ezOrgName;
      }
      this.setdataFormVal(this.dataInfo, this.dataForm);
      this.getwgyOrgInfo();
      //   if (this.dataInfo.cjInfoId) {
      //     this.getXfHyList();
      //   }
      this.getXfHyList("0");
      if (this.dataInfo.xfHyYj) {
        this.getXfHyList("1", this.dataInfo.xfHyYj);
      }
    } else {
      this.getData();
    }
    console.log(this.dataInfo, "**----**");
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
          this.dataInfo = resData;
          this.oldcbStatus = this.dataInfo.cbStatus;
          this.oldcbMoney = this.dataInfo.cbMoney;
          this.dataInfo.oldcbStatus = this.oldcbStatus;
          this.dataInfo.oldcbMoney = this.oldcbMoney;
          if (this.dataInfo.ezOrgId && !this.dataInfo.efInstId) {
            this.dataInfo.efInstId = this.dataInfo.ezOrgId;
            this.dataInfo.efInstName = this.dataInfo.ezOrgName;
          }
          this.setdataFormVal(this.dataInfo, this.dataForm);
          this.getwgyOrgInfo();
          this.getXfHyList("0");
          if (this.dataInfo.xfHyYj) {
            this.getXfHyList("1", this.dataInfo.xfHyYj);
          }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    finalSubmit() {
      this.$refs.form.submit();
    },
    staging() {
      var values = this.$refs.form.getValues();
      // 校验除*以外的身份证号
      if (values.custIdcard && !values.custIdcard.includes("*")) {
        if (!this.isIdCard(values.custIdcard)) {
          this.$toast("请输入正确的身份证号");
          return;
        }
      }
      // 检验储备金额
      if (values.cbMoney) {
        if (!this.reg.test(values.cbMoney)) {
          this.$toast("请输入正确的储备金额");
          return;
        }
      }
      var query = Object.assign(this.dataInfo, values);
      this.setCodeValues(query, this.dataForm);
      console.log(query, "请求参数");
      // 处理储备状态单选框
      query.cbStatus = this.getCode(query.cbStatus, this.cbStatusList);
      //   处理获客来源
      query.hkSource = this.getCode(query.hkSource, this.hkSourceList);
      //   处理客户类型
      query.customerType = this.getCode(
        query.customerType,
        this.customerTypeList
      );
      // 判断是否修改过储备金额或储备状态 1-修改 0-未修改
      if (
        query.cbStatus == this.oldcbStatus &&
        query.cbMoney == this.oldcbMoney
      ) {
        query.cbType = "0";
      } else {
        query.cbType = "1";
      }
      query.yjToken = sessionStorage.getItem("yjToken");
      query.isDraft = "1";
      if (query.channelWgyId) {
        // 1代表有网格员  0代表无网格员
        query.channelWgyIdFz = "1";
      } else {
        query.channelWgyIdFz = "0";
      }
      query.samllRoadshowCbCustomerVo = {
        productName: query.productName,
        efInstId: query.efInstId,
        efInstName: query.efInstName,
        khjlUserId: query.khjlUserId,
        khjlUserName: query.khjlUserName,
        ceDate: query.ceDate,
        applyMoney: query.applyMoney,
        sbDate: query.sbDate,
        sbMoney: query.sbMoney,
        hpDate: query.hpDate,
        hpMoney: query.hpMoney,
        yzyData: query.yzyData,
        yzyMoney: query.yzyMoney,
        dcIsCq: query.dcIsCq,
        fkIsCq: query.fkIsCq,
        sxData: query.sxData,
        sxMoney: query.sxMoney,
        firstZyDate: query.firstZyDate,
        firstZyMoney: query.firstZyMoney,
      };
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
      // 校验除*以外的身份证号
      if (values.custIdcard && !values.custIdcard.includes("*")) {
        if (!this.isIdCard(values.custIdcard)) {
          this.$toast("请输入正确的身份证号");
          return;
        }
      }
      // 检验储备金额
      if (values.cbMoney) {
        if (!this.reg.test(values.cbMoney)) {
          this.$toast("请输入正确的储备金额");
          return;
        }
      }
      var query = Object.assign(this.dataInfo, values);
      this.setCodeValues(query, this.dataForm);
      console.log(query, "请求参数");
      // 判断是否修改过储备金额或储备状态 1-修改 0-未修改
      if (
        query.cbStatus == this.oldcbStatus &&
        query.cbMoney == this.oldcbMoney
      ) {
        query.cbType = "0";
      } else {
        query.cbType = "1";
      }
      query.yjToken = sessionStorage.getItem("yjToken");
      query.isDraft = "0";
      if (query.channelWgyId) {
        // 1代表有网格员  0代表无网格员
        query.channelWgyIdFz = "1";
      } else {
        query.channelWgyIdFz = "0";
      }
      query.samllRoadshowCbCustomerVo = {
        productName: query.productName,
        efInstId: query.efInstId,
        efInstName: query.efInstName,
        khjlUserId: query.khjlUserId,
        khjlUserName: query.khjlUserName,
        ceDate: query.ceDate,
        applyMoney: query.applyMoney,
        sbDate: query.sbDate,
        sbMoney: query.sbMoney,
        hpDate: query.hpDate,
        hpMoney: query.hpMoney,
        yzyData: query.yzyData,
        yzyMoney: query.yzyMoney,
        dcIsCq: query.dcIsCq,
        fkIsCq: query.fkIsCq,
        sxData: query.sxData,
        sxMoney: query.sxMoney,
        firstZyDate: query.firstZyDate,
        firstZyMoney: query.firstZyMoney,
      };
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
            name: "editCbInfo",
          },
        });
      } else if (item.key == "actName") {
        console.log("跳转所属路演页面");
        this.$router.push({
          name: "activeList",
          query: {
            name: "editCbInfo",
            type: "radio",
          },
        });
      } else if (item.key == "channelBTypeName") {
        console.log("跳转所属渠道页面");
        this.$router.push({
          name: "channelList",
          query: {
            name: "editCbInfo",
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
            name: "editCbInfo",
          },
        });
      } else if (item.key == "cbStatus") {
        // if (Number(this.oldcbStatus) < 0) {
        if (
          this.oldcbStatus != "5" &&
          this.userInfo.userId == this.dataInfo.createUserId
        ) {
          this.cbStatusShowPopup = true;
        }
      } else if (item.key == "yzyData") {
        this.showCalendar = true;
      } else if (item.key == "hkSource") {
        this.hkSourceShowPopup = true;
      } else if (item.key == "customerType") {
        this.customerTypePopup = true;
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
      } else if (item.key == "productName") {
        this.productNameShowPopup = true;
      } else if (item.key == "efInstName") {
        if (!this.userInfo.ezOrgId) {
          this.efInstNamePopup = true;
        }
      } else if (
        item.key == "ceDate" ||
        item.key == "bsDate" ||
        item.key == "spDate" ||
        item.key == "edjhDate" ||
        item.key == "sczyDate"
      ) {
        if (this.ceDateType != item.key) {
          this.dateLssueVal = new Date();
        }
        this.ceDateType = item.key;
        this.showceCalendar = true;
      }
    },
    inputFun(item, i) {},
    focusFun(item, i) {
      item.error = false;
    },
    blurFun(item, i) {},
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
        if (item.key == type && type == "cbStatus") {
          item.val = e.dictName;
        } else if (item.key == type && type == "yzyData") {
          item.val = this.formatDate(e);
        } else if (item.key == type && type == "hkSource") {
          item.val = e.dictName;
        } else if (item.key == type && type == "customerType") {
          item.val = e.dictName;
        } else if (item.key == type && type == "professionName") {
          item.val = e.professionName;
          this.dataInfo.xfHy = e.professionInfoId;
        } else if (item.key == type && type == "professionYjName") {
          item.val = e.professionName;
          this.dataInfo.xfHyYj = e.professionInfoId;
          this.getXfHyList("1", this.dataInfo.xfHyYj);
        } else if (item.key == type && type == "productName") {
          item.val = e.dictName;
        } else if (
          // 测额日期
          item.key == type &&
          (type == "ceDate" ||
            type == "bsDate" ||
            type == "spDate" ||
            type == "edjhDate" ||
            type == "sczyDate")
        ) {
          item.val = this.formatDate(e);
        }
        // 级联选择
        if (type == "professionYjName" && item.key == "professionName") {
          item.val = "";
          this.dataInfo.xfHy = "";
        }
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
          //   if (query.hangYeType == "1" && resData.length) {
          //     this.dataInfo.professionName = resData[0].professionName;
          //     this.dataInfo.xfHy = resData[0].professionInfoId;
          //     this.setdataFormVal(this.dataInfo, this.dataForm);
          //   }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    // 获取网点
    onwgyConfirm(e, type) {
      console.log(e, "---");
      this.dataForm.some((item, index) => {
        if (item.key == type && type == "efInstName") {
          item.val = e.instName;
        }
      });
      if (type == "efInstName") {
        this.dataInfo.efInstId = e.instId;
        this.dataInfo.efInstName = e.instName;
      }
    },
    // 获取网点列表
    async getwgyOrgInfo() {
      console.log(this.dataInfo, "////");
      var upInstId = this.dataInfo.orgId
        ? this.dataInfo.orgId
        : this.dataInfo.upOrgId;
      var query = {
        upInstId,
        yjToken: sessionStorage.getItem("yjToken"),
      };
      console.log("获取一级支行列表参数", query);
      var encryData = this.getisEncParams(query);
      await this.$http("queryWdxInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "获取一级支行列表解密后数据");
          this.efInstNameList = resData;
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
