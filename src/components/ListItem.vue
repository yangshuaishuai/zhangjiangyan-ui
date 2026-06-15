<template>
  <div id="list-item">
    <div class="list-item" v-if="type == 0" @click="goPreview">
      <div class="left">
        <span class="title">
          {{ dataItem.actName }}
          <span v-if="dataItem.isDraft == 1">(草稿)</span>
        </span>
        <span class="text">日期：{{ dataItem.actDate }}</span>
        <span class="text"
          >地点：{{ dataItem.actCounties }} {{ dataItem.actStreet }}</span
        >
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="list-item" v-else-if="type == 1" @click="goPreview">
      <div class="left">
        <span class="title">
          {{ dataItem.custName }}
          <span v-if="dataItem.isDraft == 1">(草稿)</span>
        </span>
        <span class="text">联系方式：{{ dataItem.custPhone }}</span>
      </div>
      <div class="right" style="margin: auto 5px">
        <van-button
          plain
          type="warning"
          size="mini"
          @click.stop="transferCustomer"
          >移交</van-button
        >
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="list-item" v-else-if="type == 2" @click="goPreview">
      <div class="left">
        <span class="title">
          {{ dataItem.channelBTypeName }}
          <span v-if="dataItem.isDraft == 1">(草稿)</span>
        </span>
        <span class="text">渠道类型：{{ dataItem.actChannelTypeName }}</span>
        <span class="text">B端类型：{{ dataItem.channelTypeName }}</span>
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="list-item" v-else-if="type == 3" @click="goPreview">
      <div class="left" v-if="visitType == 0">
        <span class="title">
          {{ dataItem.channelBTypeName }}
          <van-button
            plain
            type="primary"
            size="mini"
            class="cbStatusBtn"
            @click.stop="addVisit"
          >
            &ensp;新增走访&ensp;
          </van-button>
        </span>
        <span class="text">走访日期：{{ dataItem.interviewDate }}</span>
        <span class="text">走访人员类型：{{ dataItem.interviewTypeText }}</span>
      </div>
      <div class="left" v-else>
        <span class="title">
          {{ dataItem.custName }}
          <!-- v-if="dataItem.custIsCb != '0'" -->
          <van-button
            plain
            type="primary"
            size="mini"
            class="cbStatusBtn"
            @click.stop="addVisit"
          >
            &ensp;新增走访&ensp;
          </van-button>
        </span>
        <span class="text">走访日期：{{ dataItem.interviewDate }}</span>
        <span class="text">
          走访人员类型：{{ dataItem.interviewTypeText }}</span
        >
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="list-item" v-else-if="type == 4" @click="goPreview">
      <div class="left">
        <span class="title">
          {{ dataItem.custName }}
          <span>{{ dataItem.custPhone }}</span>
        </span>
        <span class="text"
          >产品名称：{{ getVal(dataItem.productName, productNameList) }}</span
        >
        <span class="text">企业名称：{{ dataItem.qyName }}</span>
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="operate" v-if="type == 4">
      <van-button
        v-if="dataItem.cbStatus"
        plain
        :type="
          dataItem.cbStatus == 0
            ? 'danger'
            : dataItem.cbStatus == 4
            ? 'info'
            : 'primary'
        "
        hairline
        size="mini"
        class="cbStatusBtn"
        >{{ getVal(dataItem.cbStatus, cbStatusList) }}</van-button
      >
      <div v-else></div>
      <span
        v-if="userInfo.userId == dataItem.createUserId"
        class="btn"
        :class="{ disabled: dataItem.cbStatus == '5' }"
        @click.stop="cbStatusDetail(dataItem)"
        >修改储备状态</span
      >
    </div>
    <div class="list-item" v-else-if="type == 5" @click="goPreview">
      <div class="left">
        <span class="title">
          {{ dataItem.cjName }}
        </span>
        <span class="text">描述：{{ dataItem.description }}</span>
        <span class="text">操作人名称：{{ dataItem.updateUserName }}</span>
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "dataItem",
    "type",
    "visitType",
    "channelInterviewTypeList",
    "custInterviewTypeList",
    "cbStatusList",
  ],
  name: "list-item",
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      productNameList: JSON.parse(sessionStorage.getItem("productNameList")),
    };
  },
  created() {},
  mounted() {},
  methods: {
    transferCustomer(item) {
      // 移交
      this.$emit("transferCustomer", item);
    },
    goPreview(item) {
      this.$emit("goPreview", item);
    },
    cbStatusDetail(item) {
      console.log(item, "**");
      if (item.cbStatus != "5") {
        this.$emit("cbStatusDetail", item);
      }
    },
    addVisit(item) {
      this.$emit("addVisit", item);
    },
  },
};
</script>

<style scoped lang="less">
#list-item {
  background: #fff;
  padding: 30px;
  margin: 20px;
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      flex: 1;
      .title {
        font-weight: bold;
        font-size: 30px;
        color: #393b3f;
        .cbStatusBtn {
          vertical-align: middle;
          margin-left: 30px;
          float: right;
        }
      }
      .text {
        padding-top: 20px;
        color: #99a0af;
        font-size: 28px;
      }
    }
  }
  .operate {
    border-top: 1px solid #f5f5f5;
    margin-top: 20px;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      background: #eef2fc;
      border-radius: 45px;
      color: #5176e0;
      font-size: 30px;
      line-height: 30px;
      padding: 18px 60px;
    }
    .disabled {
      opacity: 0.7;
    }
  }
}
</style>
