<template>
  <div class="pages">
    <div class="content">
      <van-field
        class="title"
        label="所属场景"
        :value="dataInfo.cjName"
        readonly
        placeholder="暂无数据"
        autosize
        rows="1"
        type="textarea"
        input-align="right"
      ></van-field>
      <van-form class="detail" input-align="right" label-width="40%">
        <van-field
          label="二级分行"
          :value="dataInfo.upOrgName"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="一级支行"
          :value="dataInfo.orgName"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="二级支行"
          :value="dataInfo.ezOrgName"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="路演名称"
          :value="dataInfo.actName"
          :border="false"
          readonly
          placeholder="暂无数据"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
        <van-field
          label="路演召开日期"
          :value="dataInfo.actDate"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="路演地点"
          :value="dataInfo.actCounties + ' ' + dataInfo.actStreet"
          :border="false"
          readonly
          placeholder="暂无数据"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
        <van-field
          label="共同发起方"
          :value="dataInfo.actOrganization"
          :border="false"
          readonly
          placeholder="暂无数据"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
        <van-field
          label="共同发起方出席人员及职务"
          :value="dataInfo.actChuxiUser"
          :border="false"
          readonly
          placeholder="暂无数据"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
        <van-field
          label="路演针对的主要区域、客群"
          :value="dataInfo.actQuyuKequn"
          :border="false"
          readonly
          placeholder="暂无数据"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
        <van-field
          label="路演针对的主要行业"
          :value="dataInfo.professionName"
          :border="false"
          readonly
          placeholder="暂无数据"
          rows="1"
          autosize
          type="textarea"
        ></van-field>
        <van-field
          label="代表性企业名称"
          :value="dataInfo.actMajorEnterprise"
          :border="false"
          readonly
          placeholder="暂无数据"
          autosize
          rows="1"
          type="textarea"
        ></van-field>
        <van-field
          label="是否举办签约仪式"
          :value="getName(dataInfo.actIsSiginCermony, $global.flag)"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="是否发布宣传报道"
          :value="getName(dataInfo.actIsXuanchuanbd, $global.flag)"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <van-field
          label="宣传渠道"
          :value="
            getVal(dataInfo.actPublicityChannels, this.actPublicityChannelList)
          "
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
        <!-- 路演照片 -->
        <van-field
          label="路演照片数量"
          class="uploader"
          placeholder="暂无数据"
          :rules="[{ required: true, message: '请上传图片' }]"
          autosize
          type="textarea"
          label-width="auto"
        >
          <template #input>
            {{ fileListLength }}
            <!-- <van-image
              width="80"
              height="80"
              v-for="(item, i) in fileList"
              :key="i"
              :src="item.content"
              @click="ImageClick(item)"
            ></van-image> -->
          </template>
        </van-field>
        <van-field
          label="路演获客数量（到场加名单）"
          :value="dataInfo.actHkXdNum"
          :border="false"
          readonly
          placeholder="暂无数据"
        ></van-field>
      </van-form>
      <div class="btns">
        <van-button
          class="btn"
          color="#5176E0"
          style="margin-right: 10px"
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
    <div class="operate">
      <div class="operateTitle">
        <span class="text">共 {{ channelTotal }} 条渠道</span>
        <span class="btn" @click="relateChannel">关联渠道</span>
      </div>
      <div class="list-item" v-for="(item, i) in channelList" :key="i">
        <div class="left">
          <span class="title">{{ item.channelBTypeName }}</span>
          <span class="text">渠道类型：{{ item.channelTypeName }}</span>
        </div>
      </div>
      <div
        class="openMore"
        v-if="channelTotal > 1"
        @click="openMore('relateChannelList')"
      >
        查看更多
      </div>
    </div>
    <div class="operate">
      <div class="operateTitle">
        <span class="text">共 {{ custTotal }} 条客户</span>
        <span class="btn" @click="relateCust">关联客户</span>
      </div>
      <div class="list-item" v-for="(item, i) in custList" :key="i">
        <div class="left">
          <span class="title">{{ item.custName }}</span>
          <span class="text">联系方式：{{ item.custPhone }}</span>
        </div>
      </div>
      <div
        class="openMore"
        v-if="custTotal > 1"
        @click="openMore('relateCustList')"
      >
        查看更多
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Dialog, ImagePreview } from "vant";
Vue.use(ImagePreview);
export default {
  data() {
    return {
      dataInfo: {
        actName: "",
        actDate: "",
        actCounties: "",
        actStreet: "",
        upOrgName: "",
        orgName: "",
        cjName: "",
        actOrganization: "",
        actChuxiUser: "",
        actQuyuKequn: "",
        actProfession: "",
        actMajorEnterprise: "",
        actIsSiginCermony: "",
        actIsXuanchuanbd: "",
        actPublicityChannels: "",
        actHkXdNum: "",
      }, //表单信息
      channelList: [], //渠道列表
      channelTotal: 0, //渠道总数
      custList: [], //客户列表
      custTotal: 0, //客户总数
      routeQuery: {}, //路由参数
      // 渠道列表
      pageIndex: 1,
      pageSize: 1,
      // 客户列表
      custpageIndex: 1,
      fileList: [], //图片
      fileListLength: 0, //路演照片数量

      actPublicityChannelList: JSON.parse(
        sessionStorage.getItem("actPublicityChannelList")
      ), //路演活动表-宣传渠道
    };
  },
  created() {
    sessionStorage.removeItem("relateCustInfo");
    this.routeQuery = this.$route.query;
    console.log("this.routeQuery", this.routeQuery);
    this.getData();
    this.getChannelList();
    this.getCustList();
  },
  methods: {
    getData() {
      // 根据id查详情
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        actInfoId: this.routeQuery.actInfoId,
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http("querySamllRoadshowActInfoById", {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
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
    getChannelList() {
      // 获取渠道列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        actInfoId: this.routeQuery.actInfoId,
      };
      console.log(query, "获取渠道列表");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      this.$http(`querySamllRoadshowChannelInfoByActId`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "渠道列表");
          // 判断是否 下一页
          this.channelTotal = resData.total;
          this.channelloading = false;
          if (this.pageIndex * this.pageSize >= resData.total) {
            this.channelfinished = true;
          } else {
            this.channelfinished = false;
          }
          this.channelList =
            this.pageIndex == 1
              ? resData.list
              : this.channelList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    getCustList() {
      // 获取客户列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        actInfoId: this.routeQuery.actInfoId,
        actInfoIdFz: "0", //查看已关联客户
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
          this.custTotal = resData.total;
          this.custList =
            this.custpageIndex == 1
              ? resData.list
              : this.custList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    edit() {
      console.log("编辑");
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));
      this.$router.push({
        name: "editActiveInfo",
      });
    },
    // 二次确认删除
    deleteInfo() {
      Dialog.confirm({
        title: "确认删除",
        message: "确定要删除该路演吗？",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "删除",
      }).then(async () => {
        var query = {
          yjToken: sessionStorage.getItem("yjToken"),
          ids: [this.routeQuery.actInfoId],
        };
        console.log(query, "请求参数");
        var encryData = this.getisEncParams(query);
        // 执行删除操作
        await this.$http(`delSamllRoadshowActInfoByIds`, {
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
    relateChannel() {
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));

      this.$router.push({
        name: "channelList",
        query: {
          type: "checkbox",
          name: "activeDetail",
        },
      });
    },
    relateCust() {
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));

      console.log("关联客户");
      this.$router.push({
        name: "custList",
        query: {
          type: "checkbox",
          name: "activeDetail",
        },
      });
    },
    ImageClick(item) {
      console.log(item, "---");
      ImagePreview([item.content]);
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
    openMore(type) {
      this.$router.push({
        name: type,
        query: {
          name: "activeDetail",
          actInfoId: this.routeQuery.actInfoId,
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
  .van-cell {
    font-size: 28px;
    line-height: 32px;
    padding: 16px 20px;
  }
  .content {
    background: #fff;
    .detail {
      border-bottom: 1px solid #f5f5f5;
    }
    .title {
      ::v-deep .van-cell__title {
        font-size: 30px;
        line-height: 32px;
      }
      ::v-deep .van-cell__value {
        font-weight: bold;
        font-size: 32px;
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

  // 路演照片
  .uploader {
    ::v-deep .van-field__control {
      flex-wrap: wrap;
      .van-image {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>