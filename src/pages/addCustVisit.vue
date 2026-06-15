<template>
  <div class="pages">
    <div class="title" v-if="type == 'allInfo'">客户信息</div>
    <div class="kh-info" v-if="type == 'allInfo'">
      <van-form
        @failed="failed"
        :show-error-message="false"
        ref="khform"
        label-width="40%"
        input-align="right"
      >
        <my-field
          :dataForm="khdataForm"
          :dataInfo="khdataInfo"
          @showPicker="(item, i) => showPickerFun(item, i)"
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
    </div>
    <div class="title">客户走访信息</div>
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
          :value="getVal(dataInfo.interviewType, interviewTypeCols)"
          required
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
          name="interviewDate"
          label="走访日期"
          placeholder="请选择走访日期"
          @click="showCalendar = true"
          :rules="[{ required: true, message: '请选择走访日期' }]"
        />
        <van-field
          required
          name="interviewAddress"
          v-model="dataInfo.interviewAddress"
          label="走访地址"
          placeholder="请点击定位"
          readonly
          rows="1"
          autosize
          type="textarea"
          label-width="30%"
          :rules="[{ required: true, message: '请点击定位' }]"
        >
          <template #button>
            <div class="address" @click="toPositionClient">
              <img src="../assets/img/position.png" alt="" />
              <span>点击定位</span>
            </div>
          </template>
        </van-field>
        <van-field
          required
          :label="'走访照片(' + fileList.length + '/9)'"
          placeholder="请选择走访照片"
          input-align="right"
          name="filePaths"
          value="dataInfo.filePaths"
          :rules="[{ required: true, message: '请选择走访照片' }]"
        >
          <template #input>
            <van-uploader
              ref="fileUpload"
              :after-read="afterRead"
              v-model="fileList"
              :max-count="9"
              :multiple="false"
              @oversize="onOversize"
              :max-size="10000 * 1024"
              capture="camera"
              @click-preview="yulan"
              :preview-full-image="false"
              :before-read="beforeRead"
              :readonly="$store.state.client == 'xinchuang' ? true : false"
            >
              <div
                class="tips"
                style="width: 80px; height: 80px"
                @click="handleUploadClick"
              >
                <van-image
                  width="18px"
                  height="18px"
                  :src="require('../assets/img/camera.png')"
                >
                </van-image>
                <div class="text" style="margin-top: 3px">点击拍照</div>
              </div>
            </van-uploader>
          </template>
        </van-field>
        <van-field
          name="isCe"
          label="是否测额通过"
          required
          :rules="[{ required: true, message: '请选择是否测额通过' }]"
        >
          <template #input>
            <van-radio-group
              v-model="dataInfo.isCe"
              direction="horizontal"
              checked-color="#5176E0"
              style="display: flex"
              @change="isCeChange"
              :disabled="custIsCb === '0' ? true : false"
            >
              <van-radio name="0">是 </van-radio>
              <van-radio name="1">否 </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          name="custIsSl"
          label="是否受理"
          required
          :rules="[{ required: true, message: '请选择是否受理' }]"
        >
          <template #input>
            <van-radio-group
              v-model="dataInfo.custIsSl"
              direction="horizontal"
              checked-color="#5176E0"
              style="display: flex"
              @change="custIsSlChange"
              :disabled="
                custIsCb === '0' || dataInfo.isCe == '1' ? true : false
              "
            >
              <van-radio name="0">是 </van-radio>
              <van-radio name="1">否 </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          :required="dataInfo.custIsSl == '0' ? true : false"
          input-align="right"
          v-model="dataInfo.cubeiMoney"
          name="cubeiMoney"
          placeholder="请输入储备业务金额"
          label="储备业务金额"
          :rules="[
            {
              required: dataInfo.custIsSl == '0' ? true : false,
              message: '请输入储备业务金额',
            },
          ]"
        >
          <template #button>
            <span>万元</span>
          </template>
        </van-field>
        <van-field
          name="custIdCxgj"
          label="是否持续跟进"
          v-if="dataInfo.custIsSl == '1'"
          required
          :rules="[{ required: true, message: '请选择是否持续跟进' }]"
        >
          <template #input>
            <van-radio-group
              v-model="dataInfo.custIdCxgj"
              direction="horizontal"
              checked-color="#5176E0"
              style="display: flex"
            >
              <van-radio name="0">是 </van-radio>
              <van-radio name="1">否 </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="dataInfo.remark"
          name="remark"
          placeholder="请输入备注"
          label="备注（经营情况、资产负债情况、淡旺季情况等）"
          :required="dataInfo.custIdCxgj == '0' ? true : false"
          :rules="[
            {
              required: dataInfo.custIdCxgj == '0' ? true : false,
              pattern: strreg,
              message: '请输入正确的备注信息（不能包含手机号）',
            },
          ]"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
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
                  v-for="(item, index) in interviewTypeCols"
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
        <!-- 走访日期多选 -->
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
      </van-form>
    </div>
    <div style="height: 100px"></div>
    <div class="footer">
      <button-group
        :text1="showStagBtn || type != 'allInfo' ? '暂存' : '返回'"
        @finalSubmit="finalSubmit"
        @staging="staging()"
      ></button-group>
    </div>
  </div>
</template>
<script>
import { compressImg } from "../utils/compressImg.js";
import youjieMessage from "@/utils/youjieMessage";
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      custIsCb: "0",
      reg: /^(\d+(\.\d{1,2})?)$/,
      strreg: /^(?!.*(.)\d{6,})(.*)$/,
      dataInfo: {
        interviewType: "",
        interviewDate: "",
        interviewAddress: "",
        filePaths: [], //最终文件
        allFilePaths: [], //涉及到的全部文件
        isCe: "",
        custIsSl: "",
        cubeiMoney: "",
        custIdCxgj: "",
        remark: "",
      }, //信息
      interviewTypePicker: false, //走访人员类型弹框
      interviewTypeCols: JSON.parse(
        sessionStorage.getItem("channelInterviewTypeList")
      ),
      interviewTypecheckboxValue: [], //多选选中的值
      showCalendar: false, //日期弹框
      minDate: null, //最小日期
      maxDate: new Date(), //最大日期
      fileList: [], //图片
      routeQuery: {}, //路由参数

      // 客户走访信息
      khdataForm: [
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
        },
        {
          required: false,
          label: "网格员机构名称",
          key: "wgyEfInstName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "网格员职务",
          key: "wgyPost",
          rows: true,
          val: "",
          readonly: true,
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
          rules: [{ required: false }],
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
        // {
        //   label: "备注（经营情况、资产负债情况、淡旺季情况等）",
        //   key: "remark",
        //   rows: true,
        //   val: "",
        //   readonly: false,
        //   rules: [{ required: false }],
        // },
      ],
      khdataInfo: {},
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
      thInstIdPopup: false, //其他市分行
      thInstIdList: JSON.parse(sessionStorage.getItem("thInstIdList")), //其他市分行
      type: "",
      isDraft: "0", //0提交 1暂存
      showStagBtn: false, //是否展示暂存按钮
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")), //当前登录人信息
    };
  },
  async created() {
    this.custIsCb = sessionStorage.getItem("custIsCb");
    if (this.custIsCb == "0") {
      this.dataInfo.custIsSl = "0";
      this.dataInfo.isCe = "0";
    }
    // 设置日期限制：只能选择过去3天（包括今天）
    const today = new Date();
    this.maxDate = today;
    // 计算3天前的日期
    this.minDate = new Date();
    this.minDate.setDate(today.getDate() - 3);
    this.routeQuery = this.$route.query;
    // 客户信息缓存
    if (sessionStorage.getItem("khdataInfo")) {
      var dataInfo = JSON.parse(sessionStorage.getItem("khdataInfo"));
      this.khdataInfo = dataInfo;
      this.type = dataInfo.type;
      // 获取当前登录人机构信息
      if (this.userInfo.ezOrgId) {
        this.khdataInfo.ezOrgId = this.userInfo.ezOrgId;
        this.khdataInfo.ezOrgName = this.userInfo.ezOrgName;
      }
      if (this.userInfo.orgId) {
        this.khdataInfo.orgId = this.userInfo.orgId;
        this.khdataInfo.orgName = this.userInfo.orgName;
      }
      if (this.userInfo.upOrgId) {
        this.khdataInfo.upOrgId = this.userInfo.upOrgId;
        this.khdataInfo.upOrgName = this.userInfo.upOrgName;
      }
      if (!this.userInfo.orgId) {
        this.getorgInfo(this.khdataInfo.upOrgId); //一级支行数据
      }
      if (!this.userInfo.ezOrgId && this.khdataInfo.orgId) {
        this.getwgyOrgInfo(this.khdataInfo.orgId); //二级支行数据
      }
      this.setdataFormVal(this.khdataInfo, this.khdataForm);
      this.getXfHyList("0");
      if (this.khdataInfo.xfHyYj) {
        this.getXfHyList("1", this.khdataInfo.xfHyYj);
      }
    } else {
      // 判断是否需要展示客户信息
      if (this.routeQuery.type) {
        this.type = this.routeQuery.type;
        this.getData();
      }
    }
    // 判断是否有缓存数据
    if (sessionStorage.getItem("dataInfo")) {
      const dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      this.dataInfo = Object.assign(this.dataInfo, dataInfo);
      if (this.dataInfo?.filePaths) {
        this.fileList = this.dataInfo.filePaths;
      }
      this.showStagBtn = this.dataInfo.isDraft == "0" ? false : true;
      if (this.custIsCb == "0") {
        this.dataInfo.custIsSl = "0";
        this.dataInfo.isCe = "0";
      }
      console.log(this.dataInfo);
    } else {
      if (this.routeQuery.type == "allInfo") {
        this.showStagBtn = true;
      } else {
        this.getzfData();
      }
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
    isCeChange(e) {
      console.log(e);
      if (e == "1") {
        this.dataInfo.custIsSl = "1";
      }
    },
    custIsSlChange(e) {
      console.log(e);
      if (e == "0") {
        this.dataInfo.custIdCxgj = "";
      }
    },
    onConfirm(e, type) {
      if (!type) {
        var custId = this.dataInfo.custId || this.routeQuery.custId;
        console.log(custId, "客户id");
        // 判断是否可以走访
        var query = {
          yjToken: sessionStorage.getItem("yjToken"),
          custId: custId,
          interviewDate: this.formatDate(e),
          interviewId: this.routeQuery.interviewId || this.dataInfo.interviewId,
        };
        console.log(query, "请求参数");
        var encryData = this.getisEncParams(query);
        this.$http(`queryInterCountByCustomerIdAndUserId`, {
          ...encryData.encryQuery,
          isEnc: 1,
        }).then((res) => {
          console.log(res, "==");
          if (res.code == "0") {
            this.dataInfo.interviewDate = this.formatDate(e);
          } else {
            this.$toast(res.message);
            this.dataInfo.interviewDate = "";
          }
        });
      } else {
        this.khdataForm.map((item) => {
          if (item.key == type && type == "hkSource") {
            item.val = e.dictName;
          } else if (item.key == type && type == "professionName") {
            item.val = e.professionName;
            this.khdataInfo.xfHy = e.professionInfoId;
          } else if (item.key == type && type == "professionYjName") {
            item.val = e.professionName;
            this.khdataInfo.xfHyYj = e.professionInfoId;
            this.getXfHyList("1", this.khdataInfo.xfHyYj);
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
            this.khdataInfo.xfHy = "";
          }
        });
      }
    },
    finalSubmit() {
      this.isDraft = "0";
      if (
        this.routeQuery.type == "allInfo" ||
        sessionStorage.getItem("khdataInfo")
      ) {
        this.$refs.khform
          .validate()
          .then((res) => {
            this.$refs.form.submit();
          })
          .catch((err) => {
            console.log(err, "eeeee");
            if (err.length) {
              this.$toast(err[0].message);
              return;
            }
          });
      } else {
        this.$refs.form.submit();
      }
    },
    onSubmit() {
      let arr = [];
      this.fileList.map((item) => {
        if (item.status == "done") {
          arr.push(item.filePath);
        }
      });
      if (this.isDraft == "0" && !arr.length) {
        this.$toast("请选择走访照片");
        return;
      }
      this.dataInfo.filePaths = arr;
      this.dataInfo.allFilePaths = arr;
      console.log(this.dataInfo, this.fileList, "提交表单");
      if (this.dataInfo.cubeiMoney) {
        if (!this.reg.test(this.dataInfo.cubeiMoney)) {
          this.$toast("请输入正确的储备业务金额");
          return;
        }
      }
      this.dataInfo.yjToken = sessionStorage.getItem("yjToken");
      this.dataInfo.isDraft = this.isDraft;
      if (
        this.routeQuery.type == "allInfo" ||
        sessionStorage.getItem("khdataInfo")
      ) {
        var values = this.$refs.khform.getValues();
        var khquery = Object.assign(this.khdataInfo, values);
        this.setCodeValues(khquery, this.khdataForm);
        khquery.yjToken = sessionStorage.getItem("yjToken");
        khquery.isDraft = "0";
        if (khquery.channelWgyId) {
          // 1代表有网格员  0代表无网格员
          khquery.channelWgyIdFz = "1";
        } else {
          khquery.channelWgyIdFz = "0";
        }
        if (khquery.ezOrgId) {
          khquery.gsInstId = khquery.ezOrgId;
          khquery.gsInstName = khquery.ezOrgName;
        } else if (khquery.orgId) {
          khquery.gsInstId = khquery.orgId;
          khquery.gsInstName = khquery.orgName;
        } else if (khquery.upOrgId) {
          khquery.gsInstId = khquery.upOrgId;
          khquery.gsInstName = khquery.upOrgName;
        }
        this.dataInfo.custId = this.khdataInfo.custId;
        this.dataInfo.orgId = this.khdataInfo.orgId;
        this.dataInfo.orgName = this.khdataInfo.orgName;
        this.dataInfo.upOrgId = this.khdataInfo.upOrgId;
        this.dataInfo.upOrgName = this.khdataInfo.upOrgName;
        this.dataInfo.cjInfoId = this.khdataInfo.cjInfoId;
        console.log(
          {
            samllRoadshowCustomerVo: khquery,
            samllRoadshowCustomerInterviewVo: this.dataInfo,
          },
          "提交参数"
        );
        var encryData = this.getisEncParams({
          samllRoadshowCustomerVo: khquery,
          samllRoadshowCustomerInterviewVo: this.dataInfo,
        });
        this.$http("saveOrUpdateAllSamllRoadshowCustomerInterview", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            this.$router.replace({ name: "submitsuccess" });
          })
          .catch(() => {
            console.log("请求失败");
          });
      } else {
        console.log(this.dataInfo, "请求参数");
        var encryData = this.getisEncParams(this.dataInfo);
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
      }
    },
    failed(e) {
      if (e.errors.length) {
        this.$toast(e.errors[0].message);
      }
    },
    staging() {
      if (this.showStagBtn || this.type != "allInfo") {
        this.isDraft = "1";
        this.onSubmit();
      } else {
        this.$router.go(-1);
      }
    },
    toPositionClient() {
      if (this.$store.state.client == "xinchuang") {
        this.toPositionYL();
      } else {
        this.toPosition();
      }
    },
    toPosition() {
      try {
        if (this.type || this.khdataInfo.type == "allInfo") {
          var khvalues = this.$refs.khform.getValues();
          var khquery = Object.assign(this.khdataInfo, khvalues);
          khquery.type = "allInfo";
          sessionStorage.setItem("khdataInfo", JSON.stringify(khquery));
          this.dataInfo.custId = khquery.custId;
          this.dataInfo.cjInfoId = khquery.cjInfoId;
        }
        var query = this.dataInfo;
        if (this.fileList.length) {
          // 定位修改后走访照片重新上传
          this.fileList = [];
          query.filePaths = [];
        }
        sessionStorage.setItem("dataInfo", JSON.stringify(query));
        // 定位
        if (
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "test"
        ) {
          this.$router.push({
            name: "positioningInput",
            query: {
              lng: 118.720271,
              lat: 31.99066,
              status: "error",
              name: "addCustVisit",
            },
          });
          return;
        }
        try {
          // 邮捷获取定位
          let geolocation = requireModuleJs("geolocation");
          if (!geolocation) {
            this.$router.push({
              name: "positioningInput",
              query: {
                lng: 118.720271,
                lat: 31.99066,
                status: "error",
                name: "addCustVisit",
              },
            });
            return;
          }
          geolocation.get((ret) => {
            console.log(ret);
            if (ret.latitude) {
              this.$http3("coordinateConversion", {
                longitude: ret.longitude,
                latitude: ret.latitude,
                conversionFrom: "1",
                conversionTo: "5",
              }).then((res) => {
                console.log(res);
                let latitude = res.data.targetLatitude;
                let longitude = res.data.targetLongitude;

                this.$http3("coordinateToAddress", {
                  longitude: longitude,
                  latitude: latitude,
                }).then((res) => {
                  console.log(res);
                  if (res.code == 0) {
                    this.$router.push({
                      name: "positioningInput",
                      query: {
                        province: res.data.province,
                        city: res.data.city,
                        district: res.data.district,
                        address: res.data.address,
                        lng: longitude,
                        lat: latitude,
                        name: "addCustVisit",
                      },
                    });
                  } else {
                    this.$toast(res.message);
                  }
                });
              });
            } else {
              // this.$toast('邮捷定位失败,请联系管理员!')
              this.$router.push({
                name: "positioningInput",
                query: {
                  lng: 118.720271,
                  lat: 31.99066,
                  status: "error",
                  name: "addCustVisit",
                },
              });
              return;
            }
          });
        } catch {
          this.$router.push({
            name: "positioningInput",
            query: {
              lng: 118.720271,
              lat: 31.99066,
              status: "error",
              name: "addCustVisit",
            },
          });
        }
      } catch (err) {
        this.$router.push({
          name: "positioningInput",
          query: {
            lng: 118.720271,
            lat: 31.99066,
            status: "error",
            name: "addCustVisit",
          },
        });
      }
    },
    toPositionYL() {
      if (this.type || this.khdataInfo.type == "allInfo") {
        var khvalues = this.$refs.khform.getValues();
        var khquery = Object.assign(this.khdataInfo, khvalues);
        khquery.type = "allInfo";
        sessionStorage.setItem("khdataInfo", JSON.stringify(khquery));
        this.dataInfo.custId = khquery.custId;
        this.dataInfo.cjInfoId = khquery.cjInfoId;
      }
      var query = this.dataInfo;
      if (this.fileList.length) {
        // 定位修改后走访照片重新上传
        this.fileList = [];
        query.filePaths = [];
      }
      console.log(query, "query-----");
      sessionStorage.setItem("dataInfo", JSON.stringify(query));
      // 定位
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        this.$router.push({
          name: "positioningInput",
          query: {
            lng: 118.720271,
            lat: 31.99066,
            status: "error",
            name: "addCustVisit",
          },
        });
        return;
      }
      try {
        // 邮连获取定位
        youjieMessage
          .postMessageToParent("getLocationInfo")
          .then((result) => {
            if (result.success) {
              console.log("触发成功:", result.data);
              if (result.data.code == "00") {
                // 将邮捷经纬度转成百度经纬度
                this.$http3("coordinateConversion", {
                  longitude: result.data.data.lng,
                  latitude: result.data.data.lat,
                  conversionFrom: "3",
                  conversionTo: "5",
                }).then((res) => {
                  console.log(res);
                  let latitude = res.data.targetLatitude;
                  let longitude = res.data.targetLongitude;
                  // 将经纬度转成地址
                  this.$http3("coordinateToAddress", {
                    longitude: longitude,
                    latitude: latitude,
                  }).then((res) => {
                    console.log(res);
                    if (res.code == 0) {
                      // 邮捷定位
                      this.$router.push({
                        name: "positioningInput",
                        query: {
                          province: res.data.province,
                          city: res.data.city,
                          district: res.data.district,
                          address: res.data.address,
                          lng: result.data.data.lng,
                          lat: result.data.data.lat,
                          name: "addCustVisit",
                        },
                      });
                    } else {
                      this.$toast(res.message);
                    }
                  });
                });
              } else {
                this.$toast("定位失败,请联系管理员!");
                return;
              }
            } else {
              this.$router.push({
                name: "positioningInput",
                query: {
                  lng: 118.720271,
                  lat: 31.99066,
                  status: "error",
                  name: "addCustVisit",
                },
              });
            }
          })
          .catch((e) => {
            console.log(e, "--**");
            this.$toast("邮捷定位失败,请联系管理员!");
          });
      } catch {
        this.$router.push({
          name: "positioningInput",
          query: {
            lng: 118.720271,
            lat: 31.99066,
            status: "error",
            name: "addCustVisit",
          },
        });
      }
    },
    onOversize(file) {
      this.$toast.fail("文件大小不能超过10M");
    },
    /**
     * 核心工具：给纯Base64补全前缀（自动识别图片类型）
     * @param {String} pureBase64 不带前缀的纯Base64字符串
     * @returns {String} 带完整前缀的Base64字符串
     */
    addBase64Prefix(pureBase64) {
      // 已带前缀则直接返回
      if (pureBase64.startsWith("data:image/")) {
        return pureBase64;
      }

      // 提取Base64前10个字符，自动识别图片类型
      const header = pureBase64.substring(0, 10);
      let imageType = "jpeg"; // 默认JPEG

      // 不同图片格式的Base64头特征
      if (header.includes("iVBORw0KGgo")) {
        imageType = "png"; // PNG格式特征
      } else if (header.includes("UklGR")) {
        imageType = "webp"; // WEBP格式特征
      } else if (header.includes("R0lGODlh")) {
        imageType = "gif"; // GIF格式特征
      } else if (header.includes("Qk0=")) {
        imageType = "bmp"; // BMP格式特征
      }

      // 补全前缀
      return `data:image/${imageType};base64,${pureBase64}`;
    },
    // base64编码转file文件
    dataURLtoFile(dataurl, fileName) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
    handleUploadClick() {
      console.log("点击拍照");
      if (!this.dataInfo.interviewAddress) {
        this.$toast("请先定位详细地址再上传图片");
        this.fileList = [];
        return;
      }
      youjieMessage
        .postMessageToParent(
          "takePhoto",
          {
            isCompress: 1,
            //   compressFactor: 1024,
            compressFactor: 200,
          },
          50000
        )
        .then((photores) => {
          console.log(photores, "点击文件上传拍照返回值");
          if (photores.data.code == "00") {
            var fileBase64 = this.addBase64Prefix(
              photores.data.data.fileBase64
            );
            var query = this.parseFormData({
              imageData: this.dataURLtoFile(
                fileBase64,
                photores.data.data.fileName
              ),
              samllRoadshowFileInfoVo: JSON.stringify({
                fileName: photores.data.data.fileName,
                actInfoId: this.dataInfo.interviewId,
                fileType: 0,
                yjToken: sessionStorage.getItem("yjToken"),
                interviewAddress: this.dataInfo.interviewAddress,
              }),
            });
            console.log(query, "-*-");
            this.$http("uploadSyFile", query)
              .then((res) => {
                this.fileList.push({
                  url: this.addBase64Prefix(photores.data.data.fileBase64),
                  status: "done",
                  name: photores.data.data.fileName,
                  isImage: true, //不然回显不出来
                  filePath: res.message,
                });
                console.log(this.fileList, "---**");
              })
              .catch((err) => {
                console.log(err, "*****err");
                this.fileList.push({
                  url: this.addBase64Prefix(photores.data.data.fileBase64),
                  status: "failed",
                  message: "上传失败",
                  name: photores.data.data.fileName,
                  isImage: true, //不然回显不出来
                });
              });
          } else {
            this.$toast(photores.data.msg);
          }
        })
        .catch((err) => {
          this.$toast(err.error || "请求错误，请重试或联系管理员！");
          console.log(err, "----err");
        });
    },
    beforeRead() {
      if (this.$store.state.client == "xinchuang") {
        return false;
      } else {
        return true;
      }
    },
    afterRead(file) {
      let arr = [];
      if (file.length > 0) {
        arr = file;
      } else {
        arr[0] = file;
      }
      arr.map((item) => {
        console.log(item, "123------");
        this.$toast.loading({
          duration: 1, // 持续展示 toast
          forbidClick: true,
          message: "文件压缩中...",
        });
        compressImg(item.file).then(async (res) => {
          this.$toast.clear();
          console.log(res);
          console.log("读取后的文件打印>>>>>>");
          try {
            if (!this.dataInfo.interviewAddress) {
              this.$toast("请先定位详细地址再上传图片");
              this.fileList = [];
              return;
            }
            var query = this.parseFormData({
              imageData: res,
              samllRoadshowFileInfoVo: JSON.stringify({
                fileName: res.name,
                actInfoId: this.dataInfo.interviewId,
                fileType: 0,
                yjToken: sessionStorage.getItem("yjToken"),
                interviewAddress: this.dataInfo.interviewAddress,
              }),
            });
            console.log(query, "-*-");
            this.$http("uploadSyFile", query)
              .then((res) => {
                file.status = "done";
                file.filePath = res.message;
                console.log(res, "**---");
              })
              .catch((err) => {
                console.log(err, "--**");
                file.status = "failed";
                file.message = "上传失败";
              });
          } catch (error) {
            console.log(error, "error");
            this.$toast("图片上传失败");
            this.fileList.splice(this.fileList.length - 1, 1);
          }
        });
      });
    },
    // 获取客户信息
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
          console.log(resData, "客户信息详情");
          this.khdataInfo = resData;
          console.log(this.khdataInfo, "-------");
          // 获取当前登录人机构信息
          if (this.userInfo.ezOrgId) {
            this.khdataInfo.ezOrgId = this.userInfo.ezOrgId;
            this.khdataInfo.ezOrgName = this.userInfo.ezOrgName;
          }
          if (this.userInfo.orgId) {
            this.khdataInfo.orgId = this.userInfo.orgId;
            this.khdataInfo.orgName = this.userInfo.orgName;
          }
          if (this.userInfo.upOrgId) {
            this.khdataInfo.upOrgId = this.userInfo.upOrgId;
            this.khdataInfo.upOrgName = this.userInfo.upOrgName;
          }
          if (!this.userInfo.orgId) {
            this.getorgInfo(this.khdataInfo.upOrgId); //一级支行数据
          }
          if (!this.userInfo.ezOrgId && this.khdataInfo.orgId) {
            this.getwgyOrgInfo(this.khdataInfo.orgId); //二级支行数据
          }
          this.setdataFormVal(this.khdataInfo, this.khdataForm);
          this.getXfHyList("0");
          if (this.dataInfo.xfHyYj) {
            this.getXfHyList("1", this.dataInfo.xfHyYj);
          }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    // 获取走访信息
    getzfData() {
      // 根据id查客户走访详情
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        interviewId: this.routeQuery.interviewId,
      };
      console.log(query, "根据id查客户详情");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowCustomerInterviewById", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "客户走访详情");
          this.dataInfo = resData;
          sessionStorage.setItem("custIsCb", this.dataInfo.custIsCb);
          this.custIsCb = this.dataInfo.custIsCb;
          if (this.custIsCb == "0" && this.dataInfo.isDraft != "0") {
            this.dataInfo.custIsSl = "0";
            this.dataInfo.isCe = "0";
          }
          if (this.dataInfo.filePath) {
            var arr = this.dataInfo.filePath.split(",");
            arr.map((item, i) => {
              // 暂存已有的图片
              arr[i] = {
                url: require("../assets/img/unPrviewOpen.jpg"),
                filePath: item,
                status: "done",
              };
            });
            this.dataInfo.filePaths = arr;
            this.fileList = arr;
            console.log(arr, this.dataInfo, this.fileList, "1111111");
          }
          this.showStagBtn = this.dataInfo.isDraft == "0" ? false : true;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    showPickerFun(item, i) {
      var khvalues = this.$refs.khform.getValues();
      var khquery = Object.assign(this.khdataInfo, khvalues);
      khquery.type = "allInfo";
      sessionStorage.setItem("khdataInfo", JSON.stringify(khquery));
      var values = this.$refs.form.getValues();
      var query = Object.assign(this.dataInfo, values);
      //   处理走访人员类型
      query.interviewType = this.getCode(
        query.interviewType,
        this.interviewTypeCols
      );
      if (query.filePaths.length) {
        // 若有走访照片展示空白
        let imgs = query.filePaths;
        let arr = [];
        imgs.map((item, i) => {
          // 暂存已有的图片
          if (item.status == "done") {
            arr.push({
              url: require("../assets/img/unPrviewOpen.jpg"),
              filePath: item.filePath,
              status: "done",
            });
          }
        });
        this.dataInfo.filePaths = arr;
      }
      sessionStorage.setItem("dataInfo", JSON.stringify(query));
      console.log(query);
      if (item.key == "cjName") {
        // 新增走访不可修改场景
        return;
        console.log("跳转所属场景");
        this.$router.push({
          name: "home",
          query: {
            name: "addCustVisit",
          },
        });
      } else if (item.key == "actName") {
        console.log("跳转所属路演页面");
        this.$router.push({
          name: "activeList",
          query: {
            name: "addCustVisit",
            type: "radio",
          },
        });
      } else if (item.key == "channelBTypeName") {
        console.log("跳转所属渠道页面");
        this.$router.push({
          name: "channelList",
          query: {
            name: "addCustVisit",
            type: "radio",
          },
        });
      } else if (item.key == "wgyName") {
        console.log("跳转网格员选择");
        if (!khquery.channelBTypeName) {
          this.$toast("请先选择所属渠道");
          return;
        }
        this.$router.push({
          name: "wgyList",
          query: {
            name: "addCustVisit",
            type: "allInfo",
          },
        });
      } else if (item.key == "hkSource") {
        this.hkSourceShowPopup = true;
      } else if (item.key == "professionYjName") {
        this.xfHyYjShowPopup = true;
      } else if (item.key == "professionName") {
        // if (!this.khdataInfo.cjInfoId) {
        //   this.$toast("请先选择所属场景");
        // } else {
        //   this.xfHyShowPopup = true;
        // }
        if (!khvalues.professionYjName) {
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
        if (!khvalues.orgName) {
          this.$toast("请先选择一级支行");
          return;
        }
        this.ezOrgNamePopup = true;
      } else if (item.key == "thInstId") {
        this.thInstIdPopup = true;
      }
    },
    changeFun(item, i) {
      if (item.key == "isSyTh" && item.val == "0") {
        // 是否归属其他地市为否时，其他市分行为空
        this.khdataForm.some((item) => {
          if (item.key == "thInstId") {
            item.val = "";
            this.khdataInfo.thInstId = "";
          }
        });
      }
    },
    // 获取网点
    onwgyConfirm(e, type) {
      console.log(e, "---");
      this.khdataForm.some((item, index) => {
        if (item.key == type && (type == "ezOrgName" || type == "orgName")) {
          item.val = e.instName;
        }
        if (type == "orgName" && item.key == "ezOrgName") {
          item.val = "";
        }
      });
      if (type == "ezOrgName") {
        this.khdataInfo.ezOrgId = e.instId;
        this.khdataInfo.ezOrgName = e.instName;
      } else if (type == "orgName") {
        this.khdataInfo.orgId = e.instId;
        this.khdataInfo.orgName = e.instName;
        this.getwgyOrgInfo(this.khdataInfo.orgId);
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
      if (this.khdataInfo.cjName) {
        parentCjName = this.khdataInfo.cjName.split("-")[1];
      }
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        isYj,
        parentId,
      };
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
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    yulan(e) {
      console.log(e, "---");
      if (e.file) {
        // 不需要查询接口看到数据
        ImagePreview([e.content]);
      } else if (e.isImage) {
        // 仅拍照功能
        ImagePreview([e.url]);
      } else {
        var query = {
          filePath: e.filePath,
        };
        console.log(query, "-*-");
        var encryData = this.getisEncParams(query);
        this.$http("downloadSyFile", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then(async (res) => {
            console.log(res, "下载照片");
            var resData = this.getisDecData(res.data, encryData.key, true);
            var base64 = "data:image/jpeg;base64," + resData;
            ImagePreview([base64]);
          })
          .catch((err) => {
            console.log("请求失败", err);
          });
      }
    },
    parseFormData(obj) {
      const formData = new FormData();
      for (var key in obj) {
        var val = obj[key];
        formData.append(key, val);
      }
      return formData;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../assets/css/base.less";
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
  .basic-info,
  .kh-info {
    padding: 20px;
    .uploader {
      margin-top: 15px;
      margin-left: 5px;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
  .tips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #f7f7f7;
  }
}
</style>
