<template>
  <div class="pages">
    <div class="content">
      <van-field
        class="title"
        label="姓名"
        input-align="right"
        :value="dataInfo.custName"
        readonly
        placeholder="暂无数据"
      ></van-field>
      <van-form class="detail" input-align="right" label-width="35%">
        <my-field :dataForm="dataForm" :dataInfo="dataInfo" />
      </van-form>
      <div class="btns">
        <van-button
          class="btn"
          style="margin-right: 10px"
          color="#5176E0"
          type="info"
          block
          @click="edit"
          >编辑</van-button
        >
        <van-button class="btn" type="danger" block @click="deleteInfo"
          >删除</van-button
        >
      </div>
    </div>
    <div class="operate" v-if="dataInfo.isDraft == '0'">
      <div class="operateTitle">
        <span class="text">共{{ custTotal }}条客户走访</span>
        <span class="btn" @click="addVisit">新增走访</span>
      </div>

      <div class="list-item" v-for="(item, i) in custList" :key="i">
        <div class="left">
          <span class="text"
            >走访人员类型：{{
              getVal(item.interviewType, custInterviewTypeList)
            }}</span
          >
          <span class="text">走访日期：{{ item.interviewDate }}</span>
          <span class="text"
            >储备业务金额：
            <span v-if="item.cubeiMoney || item.cubeiMoney == '0'"
              >{{ item.cubeiMoney }}万元</span
            >
            <span v-else>暂无数据</span>
          </span>
        </div>
      </div>
      <div
        class="openMore"
        v-if="custTotal > 1"
        @click="openMore('custVisitList')"
      >
        查看更多
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      dataInfo: {
        custName: "",
      },
      dataForm: [
        {
          label: "一级场景",
          key: "cjYjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "二级场景",
          key: "cjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "所属路演",
          key: "actName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "具体B端名称",
          key: "channelBTypeName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
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
          typeText: "暂无数据",
        },
        {
          label: "网格员手机号",
          key: "wgyPhone",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "网格员机构名称",
          key: "wgyEfInstName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
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
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("hkSourceList")),
        },
        {
          label: "一级行业",
          key: "professionYjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "showPicker",
        },
        {
          label: "二级行业",
          key: "professionName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "showPicker",
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
          label: "二级支行",
          key: "ezOrgName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          rows: true,
        },
        {
          label: "客户属性",
          key: "custSx",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("custSxList")),
        },
        {
          label: "客户类型",
          key: "customerType",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("customerTypeList")),
        },
        {
          label: "联系方式",
          key: "custPhone",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          maxlength: "11",
        },
        {
          label: "企业名称",
          key: "qyName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "是否归属其他地市",
          key: "isSyTh",
          val: "0",
          readonly: true,
          type: "radio",
          columns: this.$global.isSyTh,
          isRadioDisable: true,
        },
        {
          label: "其他市分行",
          key: "thInstId",
          rows: true,
          val: "",
          readonly: true,
          type: "picker",
          rows: true,
          columns: JSON.parse(sessionStorage.getItem("thInstIdList")),
          parentKey: "isSyTh",
        },
        {
          label: "其他市行归属人员姓名",
          key: "thGsUserName",
          rows: true,
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
          parentKey: "isSyTh",
        },
        {
          label: "是否授信",
          key: "key8",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          parentValKey: "limitAmt",
        },
        {
          label: "授信金额（万元）",
          key: "limitAmt",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "结余金额（万元）",
          key: "xdJyBal",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        //新增的测额情况表单
        {
          label: "测额日期",
          key: "ceDate",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "申请金额(万元)",
          key: "applyMoney",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "报审日期",
          key: "sbDate",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "报审金额(万元)",
          key: "sbMoney",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "获批日期",
          key: "hpDate",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "获批金额(万元)",
          key: "hpMoney",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "额度激活日期",
          key: "sxData",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "授信额度(万元)",
          key: "sxMoney",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "首次支用日期",
          key: "firstZyDate",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          label: "首次支用金额(万元)",
          key: "firstZyMoney",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
      ],
      routeQuery: {}, //路由参数
      custList: [], //渠道走访列表
      custloading: false,
      custfinished: false,
      custpageIndex: 1,
      pageSize: 1,
      custTotal: 0,
      custInterviewTypeList: JSON.parse(
        sessionStorage.getItem("custInterviewTypeList")
      ),
    };
  },
  created() {
    sessionStorage.removeItem("dataInfo");
    this.routeQuery = this.$route.query;
    this.getData();
    this.getChannelList();
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
          console.log(resData, "客户详情解密后数据");
          this.dataInfo = Object.assign(this.routeQuery, resData);
          console.log(this.dataInfo, "-------");
          this.setdataFormVal(this.dataInfo, this.dataForm);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    edit() {
      console.log("编辑");
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));
      this.$router.push({
        name: "editCustInfo",
      });
    },
    // 二次确认删除
    deleteInfo() {
      Dialog.confirm({
        title: "确定要删除该客户吗？",
        message: "",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "删除",
      }).then(async () => {
        var query = {
          yjToken: sessionStorage.getItem("yjToken"),
          ids: [this.routeQuery.custId],
        };
        console.log(query, "请求参数");
        var encryData = this.getisEncParams(query);
        // 执行删除操作
        await this.$http(`delSamllRoadshowCustomerByIds`, {
          ...encryData.encryQuery,
          isEnc: 1,
        }).then((res) => {
          this.$router.replace({
            name: "submitsuccess",
            query: {
              title: "删除成功！",
            },
          });
        });
      });
    },
    addVisit() {
      console.log(this.dataInfo, "---");
      var query = {
        custId: this.dataInfo.custId,
        orgId: this.dataInfo.orgId,
        orgName: this.dataInfo.orgName,
        upOrgId: this.dataInfo.upOrgId,
        upOrgName: this.dataInfo.upOrgName,
        cjInfoId: this.dataInfo.cjInfoId,
      };
      sessionStorage.setItem("dataInfo", JSON.stringify(query));
      this.$router.push({
        name: "addCustVisit",
      });
    },
    onLoadcust() {
      if (this.custList.length > 0) {
        this.custpageIndex += 1;
        this.getChannelList();
      }
    },
    getChannelList() {
      // 获取客户走访列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        custId: this.routeQuery.custId,
        isDraft: "0",
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(
        query,
        this.custpageIndex,
        this.pageSize
      );
      this.$http(`querySamllRoadshowCustomerInterviewByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.custloading = false;
          this.custTotal = resData.total;
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
    openMore(type) {
      this.$router.push({
        name: type,
        query: {
          name: "custDetail",
          custId: this.routeQuery.custId,
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
  padding: 20px;
  .content {
    background: #fff;
    .title {
      border-bottom: 1px solid #f5f5f5;
      ::v-deep .van-cell__value {
        font-weight: bold;
        font-size: 30px;
      }
    }
    .btns {
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      padding: 20px;
      display: flex;
      .btn {
        border-radius: 12px;
      }
    }
  }
  .operate {
    margin-top: 40px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    max-height: 700px;
    overflow-y: auto;
    .operateTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        font-weight: bold;
        font-size: 30px;
        color: #696c77;
        word-break: break-all;
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
    .openMore {
      text-align: center;
      padding: 10px;
      color: #5176e0;
      font-size: 30px;
      border-top: 1px solid #f5f5f5;
      margin-top: 20px;
    }
    .list-item {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        flex-direction: column;
        .title {
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
  }
}
</style>
