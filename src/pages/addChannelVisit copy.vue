<template>
  <div class="pages">
    <div class="title" v-if="type == 'allInfo'">渠道信息</div>
    <div class="qd-info" v-if="type == 'allInfo'">
      <van-form
        @failed="failed"
        :show-error-message="false"
        ref="qdform"
        label-width="40%"
        input-align="right"
      >
        <my-field
          :dataForm="qddataForm"
          :dataInfo="qddataInfo"
          @showPicker="(item, i) => showPickerFun(item, i)"
        />
        <!-- 渠道类型 -->
        <van-popup v-model="actChannelTypeShowPopup" position="bottom">
          <van-picker
            show-toolbar
            value-key="channelTypeName"
            :columns="actChannelTypeList"
            @confirm="
              actChannelTypeShowPopup = false;
              onConfirm($event, 'actChannelType');
            "
            @cancel="actChannelTypeShowPopup = false"
          ></van-picker>
        </van-popup>
        <!-- b端类型 -->
        <van-popup v-model="channelBTypeShowPopup" position="bottom">
          <van-picker
            show-toolbar
            value-key="channelTypeName"
            :columns="channelBTypeList"
            @confirm="
              channelBTypeShowPopup = false;
              onConfirm($event, 'channelType');
            "
            @cancel="channelBTypeShowPopup = false"
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
              onConfirm($event, 'orgName');
            "
            @cancel="orgNamePopup = false"
          ></van-picker>
        </van-popup>
        <!-- 渠道开发人角色 -->
        <van-popup v-model="channelDevRolePopup" position="bottom">
          <van-picker
            show-toolbar
            value-key="dictName"
            :columns="channelDevRoleList"
            @confirm="
              channelDevRolePopup = false;
              onConfirm($event, 'channelDevRole');
            "
            @cancel="channelDevRolePopup = false"
          ></van-picker>
        </van-popup>
      </van-form>
    </div>
    <div class="title">渠道走访信息</div>
    <div class="basic-info">
      <van-form
        @submit="onSubmit"
        @failed="failed"
        :show-error-message="false"
        ref="form"
        label-width="40%"
        input-align="right"
      >
        <div v-if="type != 'allInfo'">
          <van-field
            v-model="dataInfo.actChannelTypeName"
            input-align="right"
            name="actChannelTypeName"
            placeholder="暂无数据"
            label="渠道类型"
            required
            readonly
            :rules="[{ required: false }]"
            autosize
            rows="1"
            type="textarea"
          />
          <van-field
            v-model="dataInfo.channelTypeName"
            input-align="right"
            name="channelTypeName"
            placeholder="暂无数据"
            label="具体B端类型"
            required
            readonly
            :rules="[{ required: false }]"
            autosize
            rows="1"
            type="textarea"
          />
          <van-field
            v-model="dataInfo.channelBTypeName"
            input-align="right"
            name="channelBTypeName"
            placeholder="暂无数据"
            label="具体B端名称"
            required
            readonly
            :rules="[{ required: false }]"
            autosize
            rows="1"
            type="textarea"
          />
        </div>
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
          :label="'走访照片(' + fileList.length + '/9)'"
          placeholder="请选择走访照片"
          input-align="right"
          name="filePaths"
          value="dataInfo.filePaths"
          required
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
          name="remark"
          label="备注"
          placeholder="请输入备注"
          input-align="right"
          v-model="dataInfo.remark"
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
        <!-- 走访日期 -->
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
        :text1="showStagBtn || type != 'allInfo' ? '暂存' : '返回'"
        @finalSubmit="finalSubmit"
        @staging="staging()"
      ></button-group>
    </div>
  </div>
</template>
<script>
import youjieMessage from "@/utils/youjieMessage";
import { compressImg } from "../utils/compressImg.js";
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      dataInfo: {
        actChannelTypeName: "",
        interviewType: "",
        interviewDate: "",
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
      fileList: [], //图片地址

      // 渠道信息
      qddataForm: [
        {
          required: true,
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
          required: true,
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
          required: false,
          label: "所属路演",
          key: "actNames",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: false, message: "请选择所属路演" }],
          error: false,
          rows: true,
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
          type: "showPicker",
          rules: [{ required: false, message: "请选择一级支行" }],
          error: false,
        },
        {
          required: true,
          label: "渠道类型",
          key: "actChannelTypeName",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: true, message: "请输入渠道类型" }],
          error: false,
        },
        {
          required: true,
          label: "具体B端类型",
          key: "channelTypeName",
          val: "",
          readonly: true,
          type: "showPicker",
          rules: [{ required: true, message: "请输入具体B端类型" }],
          error: false,
          rows: true,
        },
        {
          required: true,
          label: "具体B端名称",
          key: "channelBTypeName",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入具体B端名称" }],
          error: false,
          rows: true,
        },
        {
          label: "渠道开发人角色",
          key: "channelDevRole",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          rules: [{ required: true, message: "请选择渠道开发人角色" }],
          columns: JSON.parse(sessionStorage.getItem("channelDevRoleList")),
        },
        {
          required: true,
          label: "渠道开发人姓名",
          key: "channelDevName",
          val: "",
          readonly: false,
          rules: [{ required: true, message: "请输入渠道开发人姓名" }],
          error: false,
          rows: true,
        },
      ],
      qddataInfo: {
        actNames: "",
        actChannelTypeName: "",
        actChannelType: "",
        channelBType: "",
        channelBTypeName: "",
        channelTypeName: "",
        channelDevRole: "",
        channelDevName: "",
      },
      actChannelTypeShowPopup: false, //渠道类型弹框
      actChannelTypeList: [], //渠道类型
      channelBTypeShowPopup: false, //B端类型弹框
      channelBTypeList: [], //b端类型
      orgNamePopup: false, //一级分行弹框
      orgNameList: [], //一级分行
      type: "",
      isDraft: "0", //0提交 1暂存
      showStagBtn: false, //是否展示暂存按钮
      channelDevRoleList: JSON.parse(
        sessionStorage.getItem("channelDevRoleList")
      ), //渠道开发人角色
      channelDevRolePopup: false, //渠道开发人角色弹框
    };
  },
  async created() {
    // 设置日期限制：只能选择过去3天（包括今天）
    const today = new Date();
    this.maxDate = today;
    // 计算3天前的日期
    this.minDate = new Date();
    this.minDate.setDate(today.getDate() - 3);
    this.routeQuery = this.$route.query;
    // 渠道信息缓存
    if (sessionStorage.getItem("qddataInfo")) {
      var dataInfo = JSON.parse(sessionStorage.getItem("qddataInfo"));
      this.qddataInfo = dataInfo;
      this.type = dataInfo.type;
      this.setdataFormVal(this.qddataInfo, this.qddataForm);
      // 获取渠道类型
      this.getActChannelType(0, "actChannelTypeList");
      // 获取b端类型
      if (this.qddataInfo.actChannelType) {
        this.getActChannelType(
          this.qddataInfo.actChannelType,
          "channelBTypeList"
        );
      }
      // 获取一级支行
      if (this.qddataInfo.upOrgId) {
        this.getorgInfo(this.qddataInfo.upOrgId);
      }
    } else {
      // 判断是否需要展示渠道信息
      if (this.routeQuery.channelId) {
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
      console.log(this.dataInfo);
      this.showStagBtn = this.dataInfo.isDraft == "0" ? false : true;
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
    onConfirm(e, type) {
      if (!type) {
        var channelId = this.dataInfo.channelId || this.routeQuery.channelId;
        console.log(channelId, "渠道id");
        // 判断是否可以走访
        var query = {
          yjToken: sessionStorage.getItem("yjToken"),
          channelId: channelId,
          interviewDate: this.formatDate(e),
          channelInterId:
            this.routeQuery.channelInterId || this.dataInfo.channelInterId,
        };
        console.log(query, "请求参数");
        var encryData = this.getisEncParams(query);
        this.$http(`queryInterCountByChannelIdAndUserId`, {
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
        if (type == "actChannelType") {
          this.qddataInfo.channelBType = "";
          this.qddataInfo.channelTypeName = "";
          // 获取b端类型选项
          this.getActChannelType(e.channelTypeId, "channelBTypeList");
        }
        this.qddataForm.some((item, index) => {
          if (type == "actChannelType" && item.key == "channelTypeName") {
            // 选择渠道类型时将具体b端类型置空
            item.val = "";
          }
          if (item.key == type + "Name") {
            item.val = e.channelTypeName;
          } else if (item.key == type && type == "orgName") {
            item.val = e.instName;
          } else if (item.key == type && type == "channelDevRole") {
            item.val = e.dictName;
          }
        });
        // 赋值id
        if (type == "orgName") {
          this.qddataInfo.orgId = e.instId;
          this.qddataInfo.orgName = e.instName;
        } else if (type == "channelType") {
          this.qddataInfo.channelBType = e.channelTypeId;
        } else {
          this.qddataInfo[type] = e.channelTypeId;
        }
        // 赋值name
        if (type != "orgName") {
          this.qddataInfo[type + "Name"] = e.channelTypeName;
        }
      }
    },
    finalSubmit() {
      this.isDraft = "0";
      if (
        this.routeQuery.type == "allInfo" ||
        sessionStorage.getItem("qddataInfo")
      ) {
        this.$refs.qdform
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
      this.dataInfo.yjToken = sessionStorage.getItem("yjToken");
      this.dataInfo.isDraft = this.isDraft;
      console.log(this.dataInfo, "走访参数");
      if (
        this.routeQuery.type == "allInfo" ||
        sessionStorage.getItem("qddataInfo")
      ) {
        var qdvalues = this.$refs.qdform.getValues();
        this.qddataInfo.yjToken = sessionStorage.getItem("yjToken");
        this.qddataInfo.isDraft = "0";
        var query = Object.assign(this.qddataInfo, qdvalues);
        this.setCodeValues(query, this.qddataForm);
        this.dataInfo.channelId = this.qddataInfo.channelId;
        this.dataInfo.orgId = this.qddataInfo.orgId;
        this.dataInfo.orgName = this.qddataInfo.orgName;
        this.dataInfo.upOrgId = this.qddataInfo.upOrgId;
        this.dataInfo.upOrgName = this.qddataInfo.upOrgName;
        this.dataInfo.cjInfoId = this.qddataInfo.cjInfoId;
        console.log(
          {
            samllRoadshowChannelInfoVo: query,
            samllRoadshowChannelInterVo: this.dataInfo,
          },
          "提交时请求参数"
        );
        var encryData = this.getisEncParams({
          samllRoadshowChannelInfoVo: query,
          samllRoadshowChannelInterVo: this.dataInfo,
        });
        this.$http("saveOrUpdateAllSamllRoadshowChannelInter", {
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
        var encryData = this.getisEncParams(this.dataInfo);
        this.$http("saveOrUpdateSamllRoadshowChannelInter", {
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
        if (this.type || this.qddataInfo.type == "allInfo") {
          var qdvalues = this.$refs.qdform.getValues();
          var qdquery = Object.assign(this.qddataInfo, qdvalues);
          qdquery.type = "allInfo";
          sessionStorage.setItem("qddataInfo", JSON.stringify(qdquery));
          this.dataInfo.channelId = qdquery.channelId;
          this.dataInfo.cjInfoId = qdquery.cjInfoId;
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
              name: "addChannelVisit",
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
                name: "addChannelVisit",
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
                        name: "addChannelVisit",
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
                  name: "addChannelVisit",
                },
              });
              return;
            }
          });
        } catch (err) {
          this.$router.push({
            name: "positioningInput",
            query: {
              lng: 118.720271,
              lat: 31.99066,
              status: "error",
              name: "addChannelVisit",
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
            name: "addChannelVisit",
          },
        });
      }
    },
    toPositionYL() {
      if (this.type || this.qddataInfo.type == "allInfo") {
        var qdvalues = this.$refs.qdform.getValues();
        var qdquery = Object.assign(this.qddataInfo, qdvalues);
        qdquery.type = "allInfo";
        sessionStorage.setItem("qddataInfo", JSON.stringify(qdquery));
        this.dataInfo.channelId = qdquery.channelId;
        this.dataInfo.cjInfoId = qdquery.cjInfoId;
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
            name: "addChannelVisit",
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
                          name: "addChannelVisit",
                        },
                      });
                    } else {
                      this.$toast(res.message);
                    }
                  });
                });
              } else {
                this.$toast("邮捷定位失败,请联系管理员!");
                return;
              }
            } else {
              this.$toast("邮捷定位失败,请联系管理员!");
              return;
            }
          })
          .catch((e) => {
            this.$toast("邮捷定位失败,请联系管理员!");
          });
      } catch {
        this.$router.push({
          name: "positioningInput",
          query: {
            lng: 118.720271,
            lat: 31.99066,
            status: "error",
            name: "addChannelVisit",
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
    async handleUploadClick() {
      console.log("点击拍照");
      if (!this.dataInfo.interviewAddress) {
        this.$toast("请先定位详细地址再上传图片");
        this.fileList = [];
        return;
      }
      await youjieMessage
        .postMessageToParent(
          "takePhoto",
          {
            isCompress: 1,
            compressFactor: 200,
          },
          50000
        )
        .then((photores) => {
          console.log(photores, "点击文件上传拍照返回值");
          if (photores.data.code == "00") {
            var query = {
              imageData: this.addBase64Prefix(photores.data.data.fileBase64),
              fileName: photores.data.data.fileName,
              actInfoId: this.dataInfo.channelInterId,
              fileType: 0,
              yjToken: sessionStorage.getItem("yjToken"),
              interviewAddress: this.dataInfo.interviewAddress,
            };
            console.log(query, "-*-");
            var encryData = this.getisEncParams(query);
            this.$http("uploadSyFile", {
              ...encryData.encryQuery,
              isEnc: 1,
            })
              .then((res) => {
                var resData = this.getisDecData(res.data, encryData.key, true);
                console.log(resData);
                this.fileList.push({
                  url: this.addBase64Prefix(photores.data.data.fileBase64),
                  status: "done",
                  name: photores.data.data.fileName,
                  isImage: true, //不然回显不出来
                  filePath: resData,
                });
                console.log(this.fileList, "---**");
              })
              .catch((err) => {
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
        compressImg(item.file, "base64").then(async (res) => {
          this.$toast.clear();
          console.log(res);
          console.log("读取后的文件打印>>>>>>");
          //   var encryData = this.getisEncParamsfile({
          //     busId: this.dataInfo.channelInterId,
          //     systemCode: "ROADSHOW",
          //   });
          //   var query = this.parseFormData({
          //     fileInfo: res,
          //     reqData: encryData.encryQuery.data,
          //     encryKey: encryData.encryQuery.dataKey,
          //   });
          try {
            if (!this.dataInfo.interviewAddress) {
              this.$toast("请先定位详细地址再上传图片");
              this.fileList = [];
              return;
            }
            var query = {
              imageData: res.base64,
              fileName: res.name,
              actInfoId: this.dataInfo.channelInterId,
              fileType: 0,
              yjToken: sessionStorage.getItem("yjToken"),
              interviewAddress: this.dataInfo.interviewAddress,
            };
            console.log(query, "-*-");
            var encryData = this.getisEncParams(query);
            this.$http("uploadSyFile", {
              ...encryData.encryQuery,
              isEnc: 1,
            })
              // this.$httpfile("fileUpload", query)
              .then((res) => {
                file.status = "done";
                var resData = this.getisDecData(res.data, encryData.key, true);
                console.log(resData);
                file.filePath = resData;
              })
              .catch((err) => {
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
    // 渠道信息
    getData() {
      // 根据id查详情
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelId: this.routeQuery.channelId,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowChannelInfoById", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          this.qddataInfo = resData;
          console.log(this.qddataInfo, "-------");
          // 将表单赋值
          this.setdataFormVal(this.qddataInfo, this.qddataForm);
          // 获取渠道类型
          this.getActChannelType(0, "actChannelTypeList");
          // 获取b端类型
          if (this.qddataInfo.actChannelType) {
            this.getActChannelType(
              this.qddataInfo.actChannelType,
              "channelBTypeList"
            );
          }
          // 获取一级支行
          if (this.qddataInfo.upOrgId) {
            this.getorgInfo(this.qddataInfo.upOrgId);
          }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    // 获取走访信息
    getzfData() {
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelInterId: this.routeQuery.channelInterId,
      };
      console.log(query, "根据id查渠道走访详情参数");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowChannelInterById", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "渠道走访详情返回值");
          this.dataInfo = resData;
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
          }
          this.showStagBtn = this.dataInfo.isDraft == "0" ? false : true;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    async getActChannelType(parentId, arr) {
      // 渠道类型，B端类型
      var parentCjName;
      if (this.qddataInfo.cjName) {
        parentCjName = this.qddataInfo.cjName.split("-")[0];
      }
      var query = {
        parentId,
        // cjInfoId: this.qddataInfo.cjInfoId,
        yjToken: sessionStorage.getItem("yjToken"),
      };
      // query.cjType = parentCjName == "场景" ? "0" : "1";
      console.log(query, "渠道类型，B端类型请求参数");
      var encryData = this.getisEncParams(query);
      await this.$http("querySamllRoadshowChannelTypeInfo", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          this[arr] = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
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
          console.log(resData, "解密后数据");
          this.orgNameList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    showPickerFun(item, i) {
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
      var qdvalues = this.$refs.qdform.getValues();
      this.qddataInfo.type = "allInfo";
      if (item.key == "actNames") {
        var qdquery = Object.assign(this.qddataInfo, qdvalues);
        sessionStorage.setItem("qddataInfo", JSON.stringify(qdquery));
        this.$router.push({
          name: "activeList",
          query: {
            name: "addChannelVisit",
            type: "checkbox",
          },
        });
      } else if (item.key == "actChannelTypeName") {
        // if (!this.qddataInfo.cjInfoId) {
        //   this.$toast("请先选择所属场景");
        // } else {
        //   this.actChannelTypeShowPopup = true;
        // }
        this.actChannelTypeShowPopup = true;
      } else if (item.key == "channelTypeName") {
        if (!this.qddataInfo.actChannelType) {
          this.$toast("请先选择渠道类型");
        } else {
          this.channelBTypeShowPopup = true;
        }
      } else if (item.key == "orgName") {
        this.orgNamePopup = true;
      } else if (item.key == "cjName") {
        // 新增走访不可修改场景
        return;
        this.qddataInfo.channelBTypeName = qdvalues.channelBTypeName;
        sessionStorage.setItem("qddataInfo", JSON.stringify(this.qddataInfo));
        // 所属场景
        this.$router.push({
          name: "home",
          query: {
            name: "addChannelVisit",
          },
        });
      } else if (item.key == "channelDevRole") {
        this.channelDevRolePopup = true;
      }
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
          // this.$http("downloadSyFile", {
          //   filePath: e.filePath,
          // })
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
  .qd-info {
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
