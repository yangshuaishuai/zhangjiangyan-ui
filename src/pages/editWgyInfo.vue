<template>
  <div class="pages">
    <div class="title">网格员信息</div>
    <div class="productItem" v-for="(item, index) in wgyList" :key="index">
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
            wgyIndex = index;
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
          :rules="[
            {
              validator: isDesPhone,
              required: false,
              message: '请输入正确的手机号',
            },
          ]"
          maxlength="11"
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
        @click="addWGY"
      >
        增加网格员
      </van-button>
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
      <button-group
        @finalSubmit="finalSubmit"
        @staging="goBack"
        text1="返回"
      ></button-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wgyList: [
        {
          channelId: "",
          wgyName: "",
          wgyPhone: "",
          wgyPost: "",
          wgyEfInstId: "",
          wgyEfInstName: "",
        },
      ], //网格员列表
      wgyorgNamePopup: false, //网格员网点弹框
      wgyIndex: "", //选中的网格员下标
      wgyorgNameList: [], //网格员网点
      dataInfo: {},
    };
  },
  created() {
    this.dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    this.wgyList[0].channelId = this.dataInfo.channelId;
    this.getwgyOrgInfo();
  },
  methods: {
    // 网格员网点
    async getwgyOrgInfo() {
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
      this.wgyList[this.wgyIndex].wgyEfInstName = e.instName;
      this.wgyList[this.wgyIndex].wgyEfInstId = e.instId;
    },
    wgyfailed(err) {
      console.log(err);
    },
    addWGY() {
      // 添加网格员
      if (this.wgyList.length) {
        var index = this.wgyList.length;
        this.$refs["wgyform" + index][0]
          .validate()
          .then((res) => {
            this.wgyList.push({
              channelId: this.dataInfo.channelId,
              wgyName: "",
              wgyPhone: "",
              wgyPost: "",
              wgyEfInstId: "",
              wgyEfInstName: "",
            });
          })
          .catch((err) => {
            console.log(err, "eeeee");
            if (err.length) {
              this.$toast(err[0].message);
              return;
            }
          });
      } else {
        this.wgyList.push({
          channelId: this.dataInfo.channelId,
          wgyName: "",
          wgyPhone: "",
          wgyPost: "",
          wgyEfInstId: "",
          wgyEfInstName: "",
        });
      }
    },
    deleteProdyct(item, index) {
      this.wgyList.splice(index, 1);
      console.log("删除网格员信息", item, index);
    },
    goBack() {
      this.$router.go(-1);
    },
    async finalSubmit() {
      try {
        var index = this.wgyList.length;
        await this.$refs["wgyform" + index][0].validate();
        var query = {
          samllRoadshowChannelWgyImportVos: this.wgyList,
          yjToken: sessionStorage.getItem("yjToken"),
        };
        console.log(query, "网格员提交参数");
        var encryData = this.getisEncParams(query);
        this.$http("batchSaveSamllRoadshowChannelWgy", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            this.$router.replace({
              name: "submitsuccess",
              query: {
                title: "新增成功！",
              },
            });
          })
          .catch((err) => {
            console.log(err, "错误");
          });
      } catch (err) {
        try {
          this.$toast(err[0].message);
        } catch (e) {}
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
  .title {
    padding: 20px;
    font-weight: bold;
    font-size: 30px;
  }
  .productItem {
    margin-bottom: 20px;
    padding: 0 20px;
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