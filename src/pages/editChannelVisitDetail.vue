<template>
  <div class="pages">
    <div class="title">渠道走访登记</div>
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
          v-model="dataInfo.actChannelTypeName"
          input-align="right"
          name="actChannelType"
          placeholder="暂无数据"
          label="路演涉及渠道类型"
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
        <van-field
          input-align="right"
          :value="getVal(dataInfo.interviewType, key9Cols)"
          required
          is-link
          rows="1"
          autosize
          type="textarea"
          readonly
          name="interviewType"
          label="走访人员类型"
          placeholder="请选择走访人员类型"
          @click="key9Picker = true"
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

        <div class="littleTitle">网格员信息</div>

        <div
          class="productItem"
          v-for="(item, index) in dataInfo.samllRoadshowChannelInterWgyVos"
          :key="index"
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
            label="姓名"
            v-model="item.wgyName"
            placeholder="请输入姓名"
            input-align="right"
          >
          </van-field>
          <van-field
            label="职务"
            v-model="item.wgyPost"
            placeholder="请输入职务"
            input-align="right"
          >
          </van-field>
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

        <!-- 走访人员类型多选 -->
        <van-popup v-model="key9Picker" position="bottom">
          <div class="van-picker__toolbar">
            <button
              type="button"
              class="van-picker__cancel"
              @click="key9Picker = false"
            >
              取消
            </button>
            <button
              type="button"
              class="van-picker__confirm"
              @click="key9Confirm()"
            >
              确认
            </button>
          </div>
          <div style="max-height: 264px; overflow-y: auto">
            <van-checkbox-group
              class="checkboxGroup"
              ref="checkboxGroup"
              v-model="key9checkboxValue"
            >
              <van-cell-group>
                <van-cell
                  v-for="(item, index) in key9Cols"
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
      </van-form>
    </div>
    <div class="operate">
      <div class="operateTitle">
        <span class="text">共 {{ custList.length }} 条客户</span>
        <span class="btn" @click="relateCust">关联客户</span>
      </div>
      <div class="list-items">
        <div class="list-item" v-for="(item, i) in custList" :key="i">
          <div class="left">
            <span class="title1">{{ item.custName }}</span>
            <span class="text">联系方式：{{ item.custPhone }}</span>
          </div>
          <!-- <van-icon name="arrow"></van-icon> -->
        </div>
      </div>
    </div>
    <div style="height: 70px"></div>
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
      dataInfo: {
        upOrgName: "",
        orgName: "",
        actNames: "",
        actDate: "",
        actChannelType: "",
        channelBType: "",
        channelBTypeName: "",
        interviewType: "",
        interviewDate: "",
        samllRoadshowChannelInterWgyVos: [
          {
            wgyName: "",
            wgyPost: "",
          },
        ], //网格员信息
        custList: [], //关联客户
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
          key: "actNames",
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
        {
          label: "路演涉及渠道类型",
          key: "actChannelType",
          rows: true,
          val: "",
          readonly: true,
          rules: [{ required: false }],
          typeText: "暂无数据",
        },
      ], //活动表单
      //走访情况表单
      key9Picker: false, //走访人员类型弹框
      key9Cols: JSON.parse(sessionStorage.getItem("channelInterviewTypeList")),
      key9checkboxValue: [], //多选选中的值
      showCalendar: false, //日期弹框
      custList: [], //关联客户列表
      // 客户列表
      custloading: false,
      custfinished: false,
      custpageIndex: 1,
      pageSize: 5,
      result: [],
      minDate: null, //最小日期
      maxDate: null, //最大日期
    };
  },
  async created() {
    this.minDate = this.getDateM(15, 15).minDate;
    this.maxDate = this.getDateM(15, 15).maxDate;
    // 判断是否有缓存数据
    if (sessionStorage.getItem("dataInfo")) {
      const dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      this.dataInfo = {
        ...dataInfo,
        samllRoadshowChannelInterWgyVos:
          dataInfo.samllRoadshowChannelInterWgyVos
            ? dataInfo.samllRoadshowChannelInterWgyVos
            : [],
      };
      this.custList = dataInfo.custList || [];
      this.result = dataInfo.result || [];
    }

    console.log("this.custList", this.custList);
    console.log("this.result", this.result);
  },
  methods: {
    onLoadcust() {
      if (this.custList.length > 0) {
        this.custpageIndex += 1;
        this.getCustList();
      }
    },
    getCustList() {
      // 获取客户列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        actInfoId: this.routeQuery.actInfoId,
        isDraft: "0",
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(
        query,
        this.custpageIndex,
        this.pageSize
      );
      this.$http(`querySamllRoadshowCustomerByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.custloading = false;
          if (this.custpageIndex * this.pageSize >= resData.total) {
            this.custfinished = true;
          } else {
            this.custfinished = false;
          }
          this.custList =
            this.custpageIndex == 1
              ? resData.list
              : this.custList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    addWGY() {
      var item = this.dataInfo.samllRoadshowChannelInterWgyVos.slice(-1)[0];
      console.log(this.dataInfo.samllRoadshowChannelInterWgyVos, item, "--");
      if (this.dataInfo.samllRoadshowChannelInterWgyVos.length) {
        if (!item.wgyName) {
          this.$toast("请将网格员姓名填写完整！");
          return;
        }
      }
      this.dataInfo.samllRoadshowChannelInterWgyVos.push({
        wgyName: "",
        wgyPost: "", //需求金额
      });
    },
    deleteProdyct(item, index) {
      this.dataInfo.samllRoadshowChannelInterWgyVos.splice(index, 1);
      console.log("删除网格员信息", item, index);
    },
    key9Confirm() {
      this.key9Picker = false;
      this.dataInfo.interviewType = this.key9checkboxValue.join(",");
    },
    channeltoggle(index) {
      this.$refs.checkboxes[index].toggle();
    },

    onConfirm(e) {
      this.dataInfo.interviewDate = this.formatDate(e);
    },
    finalSubmit() {
      this.$refs.form.submit();
    },
    onSubmit() {
      console.log(this.dataInfo, "提交表单");
      const wgyList = [...this.dataInfo.samllRoadshowChannelInterWgyVos];
      const newWGYList = [];
      wgyList.map((item) => {
        if (item.wgyName) {
          newWGYList.push(item);
        }
      });

      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        // 反显数据
        channelInterId: this.dataInfo.channelInterId,
        custIds: this.result || [], //关联客户
        interviewDate: this.dataInfo.interviewDate,
        interviewType: this.dataInfo.interviewType,
        isDraft: "0",
        samllRoadshowChannelInterWgyVos: newWGYList,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
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
    },
    failed(e) {
      if (e.errors.length) {
        this.$toast(e.errors[0].message);
      }
    },
    goback() {
      //   this.$router.go(-1);
      this.$router.replace({
        path: "/channelVisitDetail",
        query: this.dataInfo,
      });
    },
    relateCust() {
      console.log("关联客户");
      sessionStorage.setItem(
        "dataInfo",
        JSON.stringify({
          ...this.dataInfo,
          custList: this.custList,
          result: this.result,
        })
      );
      this.$router.push({
        name: "custVistList",
        query: {
          ...this.dataInfo,
          type: "checkbox",
          name: "editChannelVisitDetail",
        },
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
  .title {
    font-weight: bold;
    font-size: 30px;
    padding: 20px 20px 0;
  }
  .basic-info {
    padding: 20px;
    .littleTitle {
      font-size: 26px;
      padding: 0 0px;
      height: 60px;
      line-height: 60px;
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
  }
  .operate {
    margin-top: 40px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    max-height: 800px;
    overflow-y: auto;
    .operateTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        font-weight: bold;
        font-size: 30px;
        color: #696c77;
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
    .list-items {
      border-top: 1px solid #f5f5f5;
      margin-top: 20px;
      .list-item {
        padding: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px dashed #f5f5f5;
        .left {
          display: flex;
          flex-direction: column;
          .title1 {
            font-weight: bold;
            font-size: 30px;
            color: #393b3f;
          }
          .text {
            padding-top: 20px;
            color: #99a0af;
            font-size: 28px;
          }
        }
      }
      .list-item:last-of-type {
        border: none;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
}
</style>