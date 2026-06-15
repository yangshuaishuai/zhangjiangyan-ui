<template>
  <div class="pages">
    <div class="title">渠道信息</div>
    <div class="qd-info">
      <van-form ref="qdform" label-width="40%" input-align="right">
        <my-field :dataForm="qddataForm" :dataInfo="qddataInfo" />
      </van-form>
    </div>
    <div class="title">渠道走访信息</div>
    <div class="basic-info">
      <van-form ref="form" label-width="40%" input-align="right">
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
      qddataForm: [
        {
          label: "一级场景",
          key: "cjYjName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "二级场景",
          key: "cjName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "所属路演",
          key: "actNames",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          required: true,
          label: "二级分行",
          key: "upOrgName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "一级支行",
          key: "orgName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          required: true,
          label: "渠道类型",
          key: "actChannelTypeName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          required: true,
          label: "具体B端类型",
          key: "channelTypeName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          required: true,
          label: "具体B端名称",
          key: "channelBTypeName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
        {
          label: "渠道开发人角色",
          key: "channelDevRole",
          rows: true,
          val: "",
          readonly: true,
          typeText: "暂无数据",
          type: "picker",
          columns: JSON.parse(sessionStorage.getItem("channelDevRoleList")),
        },
        {
          required: true,
          label: "渠道开发人姓名",
          key: "channelDevName",
          val: "",
          readonly: true,
          rows: true,
          typeText: "暂无数据",
        },
      ],
      qddataInfo: {},
      dataInfo: {},
      routeQuery: {}, //路由参数
      fileListLength: 0, //路演照片数量
      interviewTypeCols: JSON.parse(
        sessionStorage.getItem("channelInterviewTypeList")
      ),
    };
  },
  created() {
    this.routeQuery = this.$route.query;
    this.getqdData();
    this.getData();
  },
  methods: {
    getData() {
      // 根据id查渠道走访详情
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
    getqdData() {
      // 根据id查渠道信息详情
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelId: this.routeQuery.channelId,
      };
      console.log(query, "根据id查渠道信息详情参数");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowChannelInfoById", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "渠道信息详情返回值");
          this.qddataInfo = resData;
          // 将表单赋值
          this.setdataFormVal(this.qddataInfo, this.qddataForm);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    goback() {
      this.$router.go(-1);
    },
    edit() {
      this.qddataInfo.type = "allInfo";
      sessionStorage.setItem("qddataInfo", JSON.stringify(this.qddataInfo));
      this.$router.push({
        name: "addChannelVisit",
        query: {
          channelInterId: this.dataInfo.channelInterId,
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
  .qd-info {
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
