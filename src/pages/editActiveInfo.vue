<template>
  <div class="pages">
    <van-form
      @submit="onSubmit"
      @failed="failed"
      :show-error-message="false"
      ref="form"
      input-align="right"
    >
      <div class="title">路演基本信息</div>
      <div class="basic-info">
        <my-field
          :dataForm="activeForm"
          :dataInfo="dataInfo"
          @showPicker="(item, i) => showPickerFun(item, i)"
          @input="(item, i) => inputFun(item, i)"
          @focus="(item, i) => focusFun(item, i)"
          @blur="(item, i) => blurFun(item, i)"
          @change="(item, i) => changeFun(item, i)"
        />
        <!-- 活动图片上传 -->
        <van-field
          :required="true"
          :label="'路演照片(' + fileList.length + '/9)'"
          class="uploader"
          :rules="[{ required: true, message: '请上传图片' }]"
        >
          <template #input>
            <van-uploader
              :before-read="beforeRead"
              v-model="fileList"
              max-count="9"
              :multiple="true"
              @oversize="onOversize"
              :max-size="10000 * 1024"
            >
            </van-uploader>
          </template>
        </van-field>
        <!-- 活动召开日期 -->
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
        <!-- 活动主要针对的行业 -->
        <van-popup v-model="actProfessionPicker" position="bottom">
          <van-picker
            show-toolbar
            value-key="professionName"
            :columns="xfHyList"
            @confirm="
              actProfessionPicker = false;
              onConfirm($event, 'professionName');
            "
            @cancel="actProfessionPicker = false"
          ></van-picker>
        </van-popup>
        <!-- 活动地点区县 -->
        <van-popup v-model="actCountiesPicker" position="bottom">
          <van-picker
            show-toolbar
            value-key="country"
            :columns="actCountiesList"
            @confirm="
              actCountiesPicker = false;
              onConfirm($event, 'actCounties');
            "
            @cancel="actCountiesPicker = false"
          ></van-picker>
        </van-popup>
        <!-- 活动地点街道 -->
        <van-popup v-model="actStreetPicker" position="bottom">
          <van-popup v-model="actStreetPicker" position="bottom">
            <div class="van-picker__toolbar">
              <button
                type="button"
                class="van-picker__cancel"
                @click="actStreetPicker = false"
              >
                取消
              </button>
              <button
                type="button"
                class="van-picker__confirm"
                @click="actStreetConfirm()"
              >
                确认
              </button>
            </div>
            <div style="max-height: 264px; overflow-y: auto">
              <van-checkbox-group
                class="checkboxGroup"
                ref="checkboxGroup"
                v-model="actStreetcheckboxValue"
              >
                <van-cell-group>
                  <van-cell
                    v-for="(item, index) in actStreetList"
                    :key="item.slgdId"
                    :title="item.street"
                    clickable
                    @click="channeltoggle(index)"
                  >
                    <template #right-icon>
                      <div>
                        <van-checkbox
                          shape="square"
                          ref="checkboxes"
                          :name="item.street"
                        />
                      </div>
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </div>
          </van-popup>
        </van-popup>
        <!-- 二级支行网点 -->
        <van-popup v-model="ezOrgNamePopup" position="bottom">
          <van-picker
            show-toolbar
            value-key="instName"
            :columns="ezOrgNameList"
            @confirm="
              ezOrgNamePopup = false;
              onConfirm($event, 'ezOrgName');
            "
            @cancel="ezOrgNamePopup = false"
          ></van-picker>
        </van-popup>
      </div>
      <div class="title">路演获客情况</div>
      <div class="basic-info">
        <my-field
          :dataForm="custAcquistForm"
          :dataInfo="dataInfo"
          @input="(item, i) => inputFun(item, i)"
          @focus="(item, i) => focusFun(item, i)"
          @blur="(item, i) => blurFun(item, i)"
        />
      </div>
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
        @staging="fileUploadAll(0)"
        text1="暂存"
      ></button-group>
    </div>
  </div>
</template>
<script>
var strreg = /^(?!.*(.)\d{6,})(.*)$/;
import { compressImg } from "../utils/compressImg.js";
export default {
  data() {
    return {
      dataInfo: {
        upOrgId: "",
        upOrgName: "",
        orgId: "",
        orgName: "",
        ezOrgName: "",
        ezOrgId: "",
        actName: "",
        actDate: "",
        actCounties: "",
        actStreet: "",
        actOrganization: "",
        actChuxiUser: "",
        actChuxiUserZhiwu: "",
        actQuyuKequn: "",
        professionName: "",
        actMajorEnterprise: "",
        actIsSiginCermony: "",
        actIsXuanchuanbd: "",
        actPublicityChannels: "",
        actHkXdNum: "",
      }, //表单信息
      activeForm: [
        {
          required: true,
          label: "所属场景",
          key: "cjName",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请输入所属场景" }],
          error: false,
          type: "showPicker",
        },
        {
          required: true,
          label: "二级分行",
          key: "upOrgName",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请输入二级分行" }],
          error: false,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "一级支行",
          key: "orgName",
          val: "",
          readonly: true,
          rules: [{ required: false, message: "请输入一级支行" }],
          error: false,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "二级支行",
          key: "ezOrgName",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: false, message: "请输入二级支行" }],
          error: false,
          typeText: "暂无数据",
        },
        {
          required: true,
          label: "路演名称",
          key: "actName",
          rows: true,
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入路演名称" }],
          error: false,
        },
        {
          required: true,
          label: "路演召开日期",
          key: "actDate",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请选择路演召开日期" }],
          type: "dateTime",
          error: false,
        },
        {
          required: true,
          label: "路演地点（县/区）",
          key: "actCounties",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请输入路演地点（县/区）" }],
          type: "showPicker",
          error: false,
        },
        {
          required: false,
          label: "路演地点（镇/街道）",
          key: "actStreet",
          val: "",
          readonly: true,
          rules: [{ required: false, message: "请输入路演地点（镇/街道）" }],
          type: "showPicker",
          error: false,
          rows: true,
        },
        {
          required: true,
          label: "共同发起方",
          key: "actOrganization",
          val: "",
          readonly: false,
          rows: true,
          rules: [{ required: true, message: "请输入共同发起方" }],
          error: false,
        },
        {
          required: true,
          label: "共同发起方出席人员及职务",
          key: "actChuxiUser",
          val: "",
          readonly: false,
          rows: true,
          rules: [
            { required: true, message: "请输入共同发起方出席人员及职务" },
          ],
          error: false,
        },
        {
          required: true,
          label: "路演针对的主要区域、客群",
          key: "actQuyuKequn",
          val: "",
          readonly: false,
          rows: true,
          rules: [
            { required: true, message: "请输入路演针对的主要区域、客群" },
          ],
          error: false,
        },
        {
          required: true,
          label: "路演针对的主要行业",
          key: "professionName",
          val: "",
          readonly: true,
          rules: [{ required: true, message: "请输入路演针对的主要行业" }],
          error: false,
          type: "showPicker",
          rows: true,
        },
        {
          required: false,
          label: "代表性企业名称",
          key: "actMajorEnterprise",
          val: "",
          readonly: false,
          rows: true,
          rules: [
            {
              required: false,
              pattern: strreg,
              message: "请输入代表性企业名称（不能包含手机号）",
            },
          ],
          error: false,
        },
        {
          required: true,
          label: "是否举办签约仪式",
          key: "actIsSiginCermony",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请选择是否举办签约仪式" }],
          type: "radio",
          columns: this.$global.flag,
          error: false,
        },
        {
          required: true,
          label: "是否发布宣传报道",
          key: "actIsXuanchuanbd",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请选择是否发布宣传报道" }],
          type: "radio",
          columns: this.$global.flag,
          error: false,
        },
        {
          required: true,
          label: "宣传渠道",
          key: "actPublicityChannels",
          val: "",
          checkboxVal: [], //多选框的值
          readonly: false,
          rules: [{ required: true, message: "请选择宣传渠道" }],
          type: "checkbox",
          columnsConfig: {
            value: "dictId",
            text: "dictName",
          },
          columns: JSON.parse(
            sessionStorage.getItem("actPublicityChannelList")
          ),
          error: false,
          parentKey: "actIsXuanchuanbd",
        },
      ], //活动基本信息表单
      custAcquistForm: [
        {
          required: true,
          label: "路演获客数量（到场加名单）",
          key: "actHkXdNum",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入路演获客数量" }],
          inputType: "digit",
          error: false,
        },
      ], //获客情况表单
      showCalendar: false, //日期弹框
      actProfessionPicker: false, //行业弹框
      xfHyList: [], //路演活动表-活动针对的主要行业
      actStreetcheckboxValue: [],
      actCountiesList: [], //活动地点区县
      actCountiesPicker: false,
      actStreetList: [], //活动昂地点街道
      actStreetPicker: false,
      fileList: [], //活动照片
      country: "", //活动地点区县值
      minDate: null, //最小日期
      maxDate: null, //最大日期
      ezOrgNameList: [], //二级支行列表
      ezOrgNamePopup: false, //二级支行弹框
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")), //当前登录人信息
    };
  },
  created() {
    this.minDate = this.getDateM(15, 15).minDate;
    this.maxDate = this.getDateM(15, 15).maxDate;

    var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    if (dataInfo) {
      this.dataInfo = dataInfo;
      console.log(this.dataInfo, "----");
      this.setdataFormVal(this.dataInfo, this.activeForm);
      this.setdataFormVal(this.dataInfo, this.custAcquistForm);
    }
    this.getXfHyList();
    if (!this.dataInfo.orgId) {
      var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      console.log(userInfo, "用户信息");
      this.dataInfo.orgId = userInfo.orgId;
      this.dataInfo.orgName = userInfo.orgName;
      this.dataInfo.upOrgId = userInfo.upOrgId;
      this.dataInfo.upOrgName = userInfo.upOrgName;
      this.dataInfo.ezOrgId = userInfo.ezOrgId;
      this.dataInfo.ezOrgName = userInfo.ezOrgName;
      this.setdataFormVal(this.dataInfo, this.activeForm);
    }
    if (this.dataInfo.actStreet) {
      this.actStreetcheckboxValue = this.dataInfo.actStreet.split(",");
    }
    if (this.dataInfo.filePath) {
      var arr = this.dataInfo.filePath.split(",");
      arr.map((item) => {
        this.fileList.push({
          url: require("@/assets/img/unPrview.png"),
          filePath: item,
          status: "done",
        });
        // this.downloadFile(item);
      });
    }
    // 获取活动地点区县
    this.getActQxInfo();
    if (!this.userInfo.ezOrgId) {
      // 获取二级支行
      this.getwgyOrgInfo();
    }
    console.log(this.dataInfo);
    if (this.dataInfo.actCounties) {
      this.country = this.dataInfo.actCounties;
      this.getActXzInfo(this.country);
    }
  },
  methods: {
    // 网格员网点
    async getwgyOrgInfo() {
      console.log(this.dataInfo, "--**");
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
          console.log(resData, "解密后数据");
          this.ezOrgNameList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    // 活动地点街道多选确定
    actStreetConfirm() {
      this.actStreetPicker = false;
      this.dataInfo.actStreet = this.actStreetcheckboxValue.join(",");
      this.activeForm.some((item) => {
        if (item.key == "actStreet") {
          item.val = this.dataInfo.actStreet;
        }
      });
    },
    channeltoggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    showPickerFun(item, i) {
      console.log(item, i);
      if (item.key == "actDate") {
        this.showCalendar = true;
      } else if (item.key == "professionName") {
        // if (!this.dataInfo.cjInfoId) {
        //   this.$toast("请先选择所属场景");
        // } else {
        //   this.actProfessionPicker = true;
        // }
        this.actProfessionPicker = true;
      } else if (item.key == "actCounties") {
        this.actCountiesPicker = true;
      } else if (item.key == "actStreet") {
        if (this.country) {
          this.actStreetPicker = true;
        } else {
          this.$toast("请先选择路演地点(区/县)");
        }
      } else if (item.key == "cjName") {
        var values = this.$refs.form.getValues();
        var query = Object.assign(this.dataInfo, values);
        if (query.actPublicityChannels) {
          query.actPublicityChannels = query.actPublicityChannels.join(",");
        }
        sessionStorage.setItem("dataInfo", JSON.stringify(query));
        // 所属场景
        this.$router.push({
          name: "home",
          query: {
            name: "editActiveInfo",
          },
        });
      } else if (item.key == "ezOrgName" && this.ezOrgNameList.length) {
        this.ezOrgNamePopup = true;
      }
    },
    inputFun(e, item, i) {},
    focusFun(item, i) {
      item.error = false;
    },
    blurFun(item, i) {},
    changeFun(item, i) {
      if (item.key == "actIsXuanchuanbd" && item.val == "1") {
        // 是否发布宣传渠道为否时，宣传渠道为空
        this.activeForm.some((item) => {
          if (item.key == "actPublicityChannels") {
            console.log(item, "***");
            item.val = "";
            item.checkboxVal = [];
            this.dataInfo.actPublicityChannels = "";
          }
        });
      }
    },
    onConfirm(e, type) {
      if (type) {
        this.activeForm.map((item) => {
          if (item.key == type && type == "actCounties") {
            item.val = e.country;
            this.country = e.country;
            this.getActXzInfo(item.val);
            this.activeForm.map((item) => {
              if (item.key == "actStreet") {
                item.val = "";
                this.actStreetcheckboxValue = [];
              }
            });
          } else if (item.key == type && type == "professionName") {
            item.val = e.professionName;
            this.dataInfo.actProfession = e.professionInfoId;
          } else if (item.key == type && type == "ezOrgName") {
            this.dataInfo.ezOrgName = e.instName;
            this.dataInfo.ezOrgId = e.instId;
            item.val = e.instName;
          }
        });
      } else {
        this.activeForm.map((item) => {
          if (item.key == "actDate") {
            item.val = this.formatDate(e);
          }
        });
      }
    },
    async getXfHyList() {
      // 获取细分行业
      var parentCjName;
      if (this.dataInfo.cjName) {
        parentCjName = this.dataInfo.cjName.split("-")[1];
      }
      var query = {
        // hangYeType: "", //"0-涉农公贷GBC联动/小企业链式开发  1-其他"
        // cjName: parentCjName,
        yjToken: sessionStorage.getItem("yjToken"),
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
          this.xfHyList = resData;
          if (query.hangYeType == "1") {
            this.dataInfo.professionName = resData[0].professionName;
            this.dataInfo.actProfession = resData[0].professionInfoId;
            this.setdataFormVal(this.dataInfo, this.activeForm);
          }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    getActQxInfo() {
      // 获取区县下拉框
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        upOrgId: JSON.parse(sessionStorage.getItem("userInfo")).upOrgId,
      };
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowActQxInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          this.actCountiesList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    getActXzInfo(country) {
      // 获取街道下拉框
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        upOrgId: JSON.parse(sessionStorage.getItem("userInfo")).upOrgId,
        country,
      };
      console.log(query, "获取街道下拉框");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowActXzInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          this.actStreetList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    finalSubmit() {
      this.fileUploadAll(0, true);
    },
    staging() {
      let arr = [];
      this.fileList.map((item) => {
        if (item.status == "done") {
          arr.push(item.filePath);
        }
      });
      this.dataInfo.filePaths = arr;
      this.dataInfo.allFilePaths = arr;
      var values = this.$refs.form.getValues();
      var query = Object.assign(this.dataInfo, values);
      console.log(arr, this.dataInfo, query, values, "***");
      if (query.actPublicityChannels) {
        query.actPublicityChannels = query.actPublicityChannels.join(",");
      }
      // 处理活动地点街道多选框
      if (query.actStreet) {
        query.actStreet = this.actStreetcheckboxValue.join(",");
      }
      query.yjToken = sessionStorage.getItem("yjToken");
      query.isDraft = "1";
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("saveOrUpdateSamllRoadshowActInfo", {
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
    onSubmit() {
      let arr = [];
      this.fileList.map((item) => {
        if (item.status == "done") {
          arr.push(item.filePath);
        }
      });
      if (!arr.length) {
        this.$toast("请上传路演照片");
      }
      this.dataInfo.filePaths = arr;
      this.dataInfo.allFilePaths = arr;
      var values = this.$refs.form.getValues();
      var query = Object.assign(this.dataInfo, values);
      if (query.actPublicityChannels) {
        query.actPublicityChannels = query.actPublicityChannels.join(",");
      }
      // 处理活动地点街道多选框
      if (query.actStreet) {
        query.actStreet = this.actStreetcheckboxValue.join(",");
      }
      query.yjToken = sessionStorage.getItem("yjToken");
      query.isDraft = "0";
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("saveOrUpdateSamllRoadshowActInfo", {
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
    failed(e) {
      console.log(e, "表单校验失败");
      if (e.errors.length) {
        this.$toast(e.errors[0].message);
      }
    },
    compressImgFun(item) {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "图片压缩中...",
        });
        compressImg(item).then((res) => {
          this.$toast.clear();
          resolve(res);
        });
      });
    },
    onOversize() {
      this.$toast.fail("文件大小不能超过10M");
    },
    async beforeRead(file) {
      let arr = [];
      if (file.length > 0) {
        arr = file;
      } else {
        arr[0] = file;
      }
      let tip = "";
      arr.map((item, i) => {
        if (
          item.type != "image/jpeg" &&
          item.type != "image/png" &&
          item.type != "image/jpg"
        ) {
          if (arr.length == 1) {
            tip = "选择的图片格式不正确";
          } else {
            tip = `选择的第${i + 1}张图片格式不正确`;
          }
        }
      });
      if (tip) {
        this.$toast.fail(tip);
        return false;
      }
      return await Promise.all(
        arr.map(async (item) => {
          // 等待异步操作完成，返回执行结果
          return await this.compressImgFun(item);
        })
      );
    },
    // 调用文件上传接口
    async fileUploadAll(index, type) {
      // 要判断状态   如果状态是成功的 不需要重复上传
      console.log(this.fileList, "this.fileList");
      if (index == this.fileList.length) {
        //  全部上传完毕
        this.$toast("图片全部上传成功");
        if (type) {
          // 正式提交
          this.$refs.form.submit();
        } else {
          // 暂存
          this.staging();
        }
        return;
      }
      let item = this.fileList[index];
      let base64;
      if (!item.filePath) {
        base64 = item.content.split(",")[1];
      }
      if (item.status == "" || item.status == "failed") {
        // 未上传和上传失败的
        var query = {
          imageData: base64, //base64数据
          fileName: item.file.name, //文件名称
          actInfoId: this.dataInfo?.actInfoId, //活动id, 新增不需要传，编辑需要传
          fileType: 0, //文件类型 0-图片 1-视频
        };
        console.log(query, "未加密参数");
        var encryData = this.getisEncParams(query);
        await this.$http("uploadFile", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            var resData = this.getisDecData(res.data, encryData.key, true);
            this.$toast("第" + (index + 1) + "个图片上传成功");
            this.fileList[index].status = "done";
            this.fileList[index].message = "";
            this.fileList[index].filePath = resData;
          })
          .catch((err) => {
            console.log(this.fileList[index], err, "eeeor");
            this.$toast.fail("第" + (index + 1) + "个文件上传失败");
            this.fileList[index].status = "failed";
            this.fileList[index].message = "上传失败";
            this.fileList[index].filePath = "";
          });
      }
      this.$toast.clear();
      index += 1;
      this.fileUploadAll(index, type);
    },
    downloadFile(filePath) {
      // 下载文件
      var query = {
        filePath,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http2("downloadFile", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var base64 = this.getBase64(res);
          this.fileList.push({
            content: base64,
            filePath: filePath,
            status: "done",
          });
          console.log(this.fileList, "**");
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    // 将流转化成base64
    getBase64(response) {
      const base64String = btoa(
        new Uint8Array(response).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      // 输出Base64编码, 下面生成的base64拼接可以直接放到< img src="放在这儿直接展示"/>
      var base64 = "data:image/jpeg;base64," + base64String;
      return base64;
    },
    parseFormData(obj) {
      const formatDate = new FormData();
      for (var key in obj) {
        formatDate.append(key, obj[key]);
      }
      return formatDate;
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
