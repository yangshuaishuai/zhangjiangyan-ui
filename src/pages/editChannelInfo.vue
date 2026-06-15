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
    <div v-if="!dataInfo.channelId">
      <div class="title">网格员信息</div>
      <div
        class="productItem"
        v-for="(item, index) in dataInfo.samllRoadshowChannelWgyVos"
        :key="index"
      >
        <van-form
          :ref="'wgyform' + (index + 1)"
          :show-error-message="false"
          label-width="40%"
          input-align="right"
          @failed="wgyfailed"
        >
          <van-field
            :label="'网格员' + Number(index + 1)"
            input-align="right"
            readonly
          >
            <template #right-icon>
              <img
                src="../assets/img/delete.png"
                style="width: 24px; margin-right: 10px"
                @click.stop="deleteProdyct(item, index)"
              />
            </template>
          </van-field>
          <van-field
            label="网点"
            v-model="item.wgyEfInstName"
            name="wgyEfInstName"
            placeholder="请选择网点"
            is-link
            required
            readonly
            :rules="[{ required: true, message: '请选择网点' }]"
            @click="
              wgyorgNamePopup = true;
              getwgyOrgInfo(index);
            "
          >
          </van-field>
          <van-field
            label="姓名"
            v-model="item.wgyName"
            name="wgyName"
            placeholder="请输入姓名"
            required
            :rules="[{ required: true, message: '请输入姓名' }]"
          >
          </van-field>
          <van-field
            label="职务"
            v-model="item.wgyPost"
            name="wgyPost"
            placeholder="请输入职务"
            required
            :rules="[{ required: true, message: '请输入职务' }]"
          >
          </van-field>
          <van-field
            label="手机号"
            v-model="item.wgyPhone"
            name="wgyPhone"
            placeholder="请输入手机号"
            maxlength="11"
            :rules="[
              {
                validator: isDesPhone,
                required: false,
                message: '请输入手机号',
              },
            ]"
          >
          </van-field>
        </van-form>
      </div>
      <div class="addWGY">
        <van-button
          native-type="button"
          style="width: auto"
          icon="plus"
          round
          type="default"
          block
          @click="addWGY()"
        >
          增加网格员
        </van-button>
      </div>
    </div>

    <!-- 网格员网点 -->
    <van-popup v-model="wgyorgNamePopup" position="bottom">
      <van-picker
        show-toolbar
        value-key="instName"
        :columns="wgyorgNameList"
        @confirm="
          wgyorgNamePopup = false;
          onwgyConfirm($event);
        "
        @cancel="wgyorgNamePopup = false"
      ></van-picker>
    </van-popup>
    <div style="height: 100px"></div>
    <div class="footer">
      <!-- v-if="dataInfo.isDraft == 0" -->
      <div class="btns">
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
      <!-- <button-group
        v-else
        @finalSubmit="finalSubmit"
        @staging="staging"
        text1="暂存"
      ></button-group> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataForm: [
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
      dataInfo: {
        actNames: "",
        actChannelTypeName: "",
        actChannelType: "",
        channelBType: "",
        channelBTypeName: "",
        channelTypeName: "",
        channelDevRole: "",
        channelDevName: "",
        samllRoadshowChannelWgyVos: [
          {
            wgyName: "",
            wgyPhone: "",
            wgyPost: "",
            wgyEfInstId: "",
            wgyEfInstName: "",
          },
        ],
      },
      actChannelTypeShowPopup: false, //渠道类型弹框
      actChannelTypeList: [], //渠道类型
      channelBTypeShowPopup: false, //B端类型弹框
      channelBTypeList: [], //b端类型
      orgNamePopup: false, //一级分行弹框
      orgNameList: [], //一级分行
      wgyorgNamePopup: false, //网格员网点弹框
      wgyIndex: "", //选中的网格员下标
      wgyorgNameList: [], //网格员网点
      channelDevRoleList: JSON.parse(
        sessionStorage.getItem("channelDevRoleList")
      ), //渠道开发人角色
      channelDevRolePopup: false, //渠道开发人角色弹框
    };
  },
  created() {
    var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    if (dataInfo) {
      this.dataInfo = Object.assign(this.dataInfo, dataInfo);
    }
    if (!this.dataInfo.orgId) {
      var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      console.log(userInfo, "用户信息");
      this.dataInfo.orgId = userInfo.orgId;
      this.dataInfo.orgName = userInfo.orgName;
      this.dataInfo.upOrgId = userInfo.upOrgId;
      this.dataInfo.upOrgName = userInfo.upOrgName;
    }
    this.setdataFormVal(this.dataInfo, this.dataForm);
    console.log(this.dataInfo, "**----**");
    // 获取渠道类型
    this.getActChannelType(0, "actChannelTypeList");
    // 获取b端类型
    if (this.dataInfo.actChannelType) {
      this.getActChannelType(this.dataInfo.actChannelType, "channelBTypeList");
    }
    // 获取一级支行
    if (this.dataInfo.upOrgId) {
      this.getorgInfo(this.dataInfo.upOrgId);
    }
  },
  methods: {
    finalSubmit() {
      this.$refs.form.submit();
    },
    staging() {
      var values = this.$refs.form.getValues();
      this.dataInfo.yjToken = sessionStorage.getItem("yjToken");
      this.dataInfo.isDraft = "1";
      if (this.dataInfo.samllRoadshowChannelWgyVos.length) {
        var channelWgyVosItem =
          this.dataInfo.samllRoadshowChannelWgyVos[
            this.dataInfo.samllRoadshowChannelWgyVos.length - 1
          ];
        if (
          !channelWgyVosItem.wgyName &&
          !channelWgyVosItem.wgyPost &&
          !channelWgyVosItem.wgyEfInstId
        ) {
          this.dataInfo.samllRoadshowChannelWgyVos.splice(
            this.dataInfo.samllRoadshowChannelWgyVos.length - 1
          );
        }
      }
      var query = Object.assign(this.dataInfo, values);
      this.setCodeValues(query, this.dataForm);
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("saveOrUpdateSamllRoadshowChannelInfo", {
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
    async onSubmit(values) {
      try {
        if (
          !this.dataInfo.channelId &&
          this.dataInfo.samllRoadshowChannelWgyVos.length
        ) {
          var index = this.dataInfo.samllRoadshowChannelWgyVos.length;
          await this.$refs["wgyform" + index][0].validate();
        }
        var values = this.$refs.form.getValues();
        this.dataInfo.yjToken = sessionStorage.getItem("yjToken");
        this.dataInfo.isDraft = "0";
        var query = Object.assign(this.dataInfo, values);
        this.setCodeValues(query, this.dataForm);
        console.log(query, "请求参数");
        var encryData = this.getisEncParams(query);
        this.$http("saveOrUpdateSamllRoadshowChannelInfo", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            this.$router.replace({ name: "submitsuccess" });
          })
          .catch((err) => {
            console.log(err, "错误");
          });
      } catch (err) {
        console.log(err, "--------*******");
        try {
          this.$toast(err[0].message);
        } catch (e) {}
      }
    },
    showPickerFun(item, i) {
      if (item.key == "actNames") {
        var values = this.$refs.form.getValues();
        var query = Object.assign(this.dataInfo, values);
        sessionStorage.setItem("dataInfo", JSON.stringify(query));
        this.$router.push({
          name: "activeList",
          query: {
            name: "editChannelInfo",
            type: "checkbox",
          },
        });
      } else if (item.key == "actChannelTypeName") {
        // if (!this.dataInfo.cjInfoId) {
        //   this.$toast("请先选择所属场景");
        // } else {
        //   this.actChannelTypeShowPopup = true;
        // }
        this.actChannelTypeShowPopup = true;
      } else if (item.key == "channelTypeName") {
        if (!this.dataInfo.actChannelType) {
          this.$toast("请先选择渠道类型");
        } else {
          this.channelBTypeShowPopup = true;
        }
      } else if (item.key == "orgName") {
        this.orgNamePopup = true;
      } else if (item.key == "cjName") {
        var values = this.$refs.form.getValues();
        var query = Object.assign(this.dataInfo, values);
        sessionStorage.setItem("dataInfo", JSON.stringify(query));
        // 所属场景
        this.$router.push({
          name: "home",
          query: {
            name: "editChannelInfo",
          },
        });
      } else if (item.key == "channelDevRole") {
        this.channelDevRolePopup = true;
      }
    },
    inputFun(item, i) {},
    focusFun(item, i) {
      item.error = false;
      console.log(item, i, "----");
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
      console.log(e, type, "---");
      if (type == "actChannelType") {
        this.dataInfo.channelBType = "";
        this.dataInfo.channelTypeName = "";
        // 获取b端类型选项
        this.getActChannelType(e.channelTypeId, "channelBTypeList");
      }
      this.dataForm.some((item, index) => {
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
        this.dataInfo.orgId = e.instId;
        this.dataInfo.orgName = e.instName;
      } else if (type == "channelType") {
        this.dataInfo.channelBType = e.channelTypeId;
      } else {
        this.dataInfo[type] = e.channelTypeId;
      }
      // 赋值name
      if (type != "orgName") {
        this.dataInfo[type + "Name"] = e.channelTypeName;
      }
    },
    async getActChannelType(parentId, arr) {
      // 渠道类型，B端类型
      var parentCjName;
      if (this.dataInfo.cjName) {
        parentCjName = this.dataInfo.cjName.split("-")[0];
      }
      var query = {
        parentId,
        // cjInfoId: this.dataInfo.cjInfoId,
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
    // 网格员网点
    async getwgyOrgInfo(index) {
      this.wgyIndex = index;
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
          this.wgyorgNameList = resData;
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    onwgyConfirm(e) {
      console.log(e);
      this.dataInfo.samllRoadshowChannelWgyVos[this.wgyIndex].wgyEfInstName =
        e.instName;
      this.dataInfo.samllRoadshowChannelWgyVos[this.wgyIndex].wgyEfInstId =
        e.instId;
    },
    wgyfailed(err) {
      console.log(err);
    },
    addWGY(type) {
      // 添加网格员
      if (this.dataInfo.samllRoadshowChannelWgyVos.length) {
        var index = this.dataInfo.samllRoadshowChannelWgyVos.length;
        this.$refs["wgyform" + index][0]
          .validate()
          .then((res) => {
            if (!type) {
              this.dataInfo.samllRoadshowChannelWgyVos.push({
                wgyName: "",
                wgyPhone: "",
                wgyPost: "",
                wgyEfInstId: "",
                wgyEfInstName: "",
              });
            }
          })
          .catch((err) => {
            console.log(err, "eeeee");
            if (err.length) {
              this.$toast(err[0].message);
              return;
            }
          });
      } else {
        if (!type) {
          this.dataInfo.samllRoadshowChannelWgyVos.push({
            wgyName: "",
            wgyPhone: "",
            wgyPost: "",
            wgyEfInstId: "",
            wgyEfInstName: "",
          });
        }
      }
    },
    deleteProdyct(item, index) {
      this.dataInfo.samllRoadshowChannelWgyVos.splice(index, 1);
      console.log("删除网格员信息", item, index);
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
  .title {
    font-weight: bold;
    font-size: 30px;
    padding: 0 20px;
  }
  .productItem {
    margin-bottom: 20px;
  }
  .addWGY {
    display: flex;
    justify-content: center;
    height: 80px;
    .van-button {
      border: 1px solid #5176e0;
      color: #5176e0;
      height: 100%;
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
