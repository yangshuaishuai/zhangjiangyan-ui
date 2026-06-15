<template>
  <div class="pages">
    <div class="title">客户信息</div>
    <div class="kh-info">
      <van-form ref="khform" label-width="40%" input-align="right">
        <my-field :dataForm="khdataForm" :dataInfo="khdataInfo" />
      </van-form>
    </div>
    <div class="title">客户走访信息</div>
    <div class="basic-info">
      <van-form ref="form" label-width="45%" input-align="right">
        <van-field
          label="走访人员类型"
          :value="getVal(dataInfo.interviewType, interviewTypeCols)"
          readonly
          placeholder="暂无数据"
          is-link
          rows="1"
          autosize
          type="textarea"
        />
        <van-field
          label="走访日期"
          :value="dataInfo.interviewDate"
          readonly
          placeholder="暂无数据"
          is-link
        ></van-field>
        <van-field
          label="储备业务金额（万元）"
          :value="dataInfo.cubeiMoney"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="走访地址"
          :value="dataInfo.interviewAddress"
          readonly
          placeholder="暂无数据"
          rows="1"
          autosize
          type="textarea"
        ></van-field>
        <van-field label="走访照片" class="uploader" placeholder="暂无数据">
          <template #input>
            {{ fileListLength }}
          </template>
        </van-field>
        <van-field label="是否测额通过">
          <template #input>
            <van-radio-group
              v-model="dataInfo.isCe"
              direction="horizontal"
              :disabled="true"
            >
              <van-radio name="0">是 </van-radio>
              <van-radio name="1">否 </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="是否受理">
          <template #input>
            <van-radio-group
              v-model="dataInfo.custIsSl"
              direction="horizontal"
              :disabled="true"
            >
              <van-radio name="0">是 </van-radio>
              <van-radio name="1">否 </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="是否持续跟进" v-if="dataInfo.custIsSl == '1'">
          <template #input>
            <van-radio-group
              v-model="dataInfo.custIdCxgj"
              direction="horizontal"
              :disabled="true"
            >
              <van-radio name="0">是 </van-radio>
              <van-radio name="1">否 </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          label="备注（经营情况、资产负债情况、淡旺季情况等）"
          :value="dataInfo.remark"
          readonly
          placeholder="暂无数据"
          rows="1"
          autosize
          type="textarea"
        ></van-field>
      </van-form>
    </div>
    <div style="height: 100px"></div>
    <div class="footer">
      <button-group
        text2="编辑"
        @finalSubmit="edit"
        @staging="goback()"
      ></button-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      khdataForm: [
        {
          label: "姓名",
          key: "custName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "一级场景",
          key: "cjYjName",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "二级场景",
          key: "cjName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "所属路演",
          key: "actName",
          val: "",
          readonly: true,
          rows: true,
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
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "网格员手机号",
          key: "wgyPhone",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
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
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("hkSourceList")),
        },
        {
          label: "一级行业",
          key: "professionYjName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
          type: "showPicker",
        },
        {
          label: "二级行业",
          key: "professionName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
          type: "showPicker",
        },
        {
          required: false,
          label: "二级分行",
          key: "upOrgName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "一级支行",
          key: "orgName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          rows: true,
        },
        {
          required: false,
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
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("custSxList")),
        },
        {
          label: "客户类型",
          key: "customerType",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("customerTypeList")),
        },
        {
          label: "联系方式",
          key: "custPhone",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "企业名称",
          key: "qyName",
          val: "",
          readonly: true,
          rows: true,
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
          required: false,
          label: "是否授信",
          key: "key8",
          val: "",
          readonly: true,
          typeText: "暂无数据",
          parentValKey: "limitAmt",
        },
        {
          required: false,
          label: "授信金额（万元）",
          key: "limitAmt",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          required: false,
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
      khdataInfo: {},
      dataInfo: {},
      routeQuery: {}, //路由参数
      fileListLength: 0, //路演照片数量
      interviewTypeCols: JSON.parse(
        sessionStorage.getItem("channelInterviewTypeList")
      ),
    };
  },
  created() {
    sessionStorage.removeItem("custIsCb");
    this.routeQuery = this.$route.query;
    this.getkhData();
    this.getData();
  },
  methods: {
    getData() {
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
          if (this.dataInfo.filePath) {
            var arr = this.dataInfo.filePath.split(",");
            this.fileListLength = arr.length;
            // arr.map((item) => {
            //   this.downloadFile(item);
            // });
          }
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    getkhData() {
      // 根据id查客户详情
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
          this.setdataFormVal(this.khdataInfo, this.khdataForm);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    goback() {
      this.$router.go(-1);
    },
    edit() {
      this.khdataInfo.type = "allInfo";
      sessionStorage.setItem("khdataInfo", JSON.stringify(this.khdataInfo));
      this.$router.push({
        name: "addCustVisit",
        query: {
          interviewId: this.dataInfo.interviewId,
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
  .basic-info,
  .kh-info {
    padding: 20px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
}
</style>
