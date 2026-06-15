<template>
  <div class="pages">
    <div class="content">
      <van-field
        class="title"
        label="具体B端名称"
        input-align="right"
        :value="dataInfo.channelBTypeName"
        readonly
        placeholder="暂无数据"
        autosize
        rows="1"
        type="textarea"
      ></van-field>
      <my-field :dataForm="dataForm" :dataInfo="dataInfo" />
      <div class="btns">
        <!-- style="margin-right: 10px" -->
        <van-button class="btn" color="#5176E0" type="info" block @click="edit"
          >编辑</van-button
        >
        <!-- <van-button class="btn" type="danger" block @click="deleteInfo"
          >删除</van-button
        > -->
      </div>
    </div>
    <div class="operate">
      <div class="operateTitle">
        <span class="text">共 {{ wgyTotal }} 网格员</span>
        <span class="btn" @click="addWGY">新增网格员</span>
      </div>
      <div class="list-item" v-for="(item, i) in wgyList" :key="i">
        <div class="left">
          <span class="title">
            <span>{{ item.wgyName }}</span>
            <span v-if="item.wgyPhone">（{{ item.wgyPhone }}）</span>
          </span>
          <span class="text">职务：{{ item.wgyPost }}</span>
        </div>
        <div class="right">
          <span
            class="btnBlue btn"
            @click="
              editProdyct(item, i);
              wgyIndex = i;
            "
            >编辑
          </span>
          <span class="btnRed btn" @click="deleteProdyct(item, i)">删除 </span>
        </div>
      </div>
      <div
        class="openMore"
        v-if="wgyTotal > 1"
        @click="openMore('channelWGYList')"
      >
        查看更多
      </div>
    </div>
    <!-- 编辑网格员信息 -->
    <van-dialog
      v-model="editWgyShow"
      title="编辑网格员信息"
      show-cancel-button
      :before-close="editWgybeforeClose"
    >
      <van-form
        ref="wgyform"
        input-align="right"
        :show-error-message="false"
        label-width="30%"
      >
        <van-field
          label="网点"
          v-model="wgyInfo.wgyEfInstName"
          name="wgyEfInstName"
          placeholder="请选择网点"
          is-link
          required
          readonly
          :rules="[{ required: true, message: '请选择网点' }]"
          @click="wgyorgNamePopup = true"
          autosize
          rows="1"
          type="textarea"
        >
        </van-field>
        <van-field
          label="姓名"
          v-model="wgyInfo.wgyName"
          name="wgyName"
          placeholder="请输入姓名"
          required
          :rules="[{ required: true, message: '请输入姓名' }]"
        >
        </van-field>
        <van-field
          label="职务"
          v-model="wgyInfo.wgyPost"
          name="wgyPost"
          placeholder="请输入职务"
          required
          :rules="[{ required: true, message: '请输入职务' }]"
        >
        </van-field>
        <van-field
          label="手机号"
          v-model="wgyInfo.wgyPhone"
          name="wgyPhone"
          placeholder="请输入手机号"
          maxlength="11"
          :rules="[{ required: false, message: '请输入手机号' }]"
        >
        </van-field>
      </van-form>
    </van-dialog>
    <div class="operate" v-if="dataInfo.isDraft == '0'">
      <div class="operateTitle">
        <span class="text">共{{ channelTotal }}条渠道走访</span>
        <span class="btn" @click="addVisit">新增走访</span>
      </div>
      <div class="list-item" v-for="(item, i) in channelList" :key="i">
        <div class="left">
          <span class="text"
            >走访人员类型：{{
              getVal(item.interviewType, channelInterviewTypeList)
            }}</span
          >
          <span class="text">走访日期：{{ item.interviewDate }}</span>
          <span class="text">备注：{{ item.remark ? item.remark : "无" }}</span>
        </div>
      </div>
      <div
        class="openMore"
        v-if="channelTotal > 1"
        @click="openMore('channelVisitList')"
      >
        查看更多
      </div>
    </div>
    <div class="operate">
      <div class="operateTitle">
        <span class="text">共 {{ custTotal }} 条客户</span>
        <!-- <span class="btn" @click="relateCust">关联客户</span> -->
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
  </div>
</template>
<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      dataInfo: {
        channelBTypeName: "",
        actChannelType: "",
        channelBType: "",
        actNames: "",
        interCount: "",
        custCount: "",
      },
      dataForm: [
        {
          required: false,
          label: "一级场景",
          key: "cjYjName",
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
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "所属路演",
          key: "actNames",
          val: "",
          rows: true,
          readonly: true,
          typeText: "暂无数据",
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
        },
        {
          required: false,
          label: "渠道类型",
          key: "actChannelTypeName",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "具体B端类型",
          key: "channelTypeName",
          val: "",
          readonly: true,
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
        {
          required: false,
          label: "走访次数",
          key: "interCount",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
        {
          required: false,
          label: "引荐客户数",
          key: "custCount",
          val: "",
          readonly: true,
          typeText: "暂无数据",
        },
      ],
      routeQuery: {}, //路由参数
      wgyTotal: 0, //网格员总数
      wgyList: [], // 网格员列表
      wgyloading: false,
      wgyfinished: false,
      wgypageIndex: 1,
      wgypageSize: 1,
      editWgyShow: false, //编辑网格员弹框
      wgyInfo: {}, //网格员表单信息
      wgyorgNamePopup: false, //网格员网点弹框
      wgyorgNameList: [], //网格员网点
      wgyIndex: "", //选中的网格员下标

      channelList: [], //渠道走访列表
      channelTotal: 0,
      channelloading: false,
      channelfinished: false,
      pageIndex: 1,
      pageSize: 1,
      channelInterviewTypeList: JSON.parse(
        sessionStorage.getItem("channelInterviewTypeList")
      ),
      custList: [], // 客户列表
      custTotal: 0,
      custloading: false,
      custfinished: false,
      custpageIndex: 1,
      custpageSize: 1,
    };
  },
  created() {
    this.routeQuery = this.$route.query;
    this.getData();
    this.getChannelList();
    this.getCustList();
    this.getWgyList();
  },
  methods: {
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
          this.dataInfo = Object.assign(this.routeQuery, resData);
          console.log(this.dataInfo, "-------");
          // 将表单赋值
          this.setdataFormVal(this.dataInfo, this.dataForm);
          // 获取网格员列表
          this.getwgyOrgInfo();
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    edit() {
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));
      console.log("编辑");
      this.$router.push({
        name: "editChannelInfo",
      });
    },
    addWGY() {
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));
      console.log("新增网格员信息");
      this.$router.push({
        name: "editWgyInfo",
      });
    },
    editProdyct(item, index) {
      this.editWgyShow = true;
      console.log(item, index, "编辑网格员信息");
      this.wgyInfo = { ...item };
    },
    onwgyConfirm(e) {
      console.log(e);
      this.wgyInfo.wgyEfInstName = e.instName;
      this.wgyInfo.wgyEfInstId = e.instId;
    },
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
    editWgybeforeClose(action, done) {
      // 编辑网格员弹框关闭
      if (action == "cancel") {
        done();
      } else {
        this.$refs.wgyform
          .validate()
          .then((res) => {
            this.wgyInfo.yjToken = sessionStorage.getItem("yjToken");
            var encryData = this.getisEncParams(this.wgyInfo);
            console.log(this.wgyInfo, "----");
            if (
              this.wgyInfo.wgyPhone &&
              !this.isDesPhone(this.wgyInfo.wgyPhone)
            ) {
              this.$toast("请输入正确的手机号");
              done(false);
              return;
            }
            this.$http("saveOrUpdateSamllRoadshowChannelWgy", {
              ...encryData.encryQuery,
              isEnc: 1,
            })
              .then((res) => {
                this.$toast("修改成功!");
                setTimeout(() => {
                  this.getWgyList();
                }, 500);
                done();
              })
              .catch((err) => {
                done(false);
                console.log(err, "错误");
              });
          })
          .catch((err) => {
            try {
              this.$toast(err[0].message);
            } catch (e) {}
            done(false);
          });
      }
    },
    deleteProdyct(item, index) {
      Dialog.confirm({
        title: "确定要删除该网格员吗？",
        message: "",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "删除",
      })
        .then(() => {
          console.log("删除网格员信息", item, index);
          var query = {
            yjToken: sessionStorage.getItem("yjToken"),
            ids: [item.channelWgyId],
          };
          var encryData = this.getisEncParams(query);
          this.$http(`delSamllRoadshowChannelWgyByIds`, {
            ...encryData.encryQuery,
            isEnc: 1,
          }).then((res) => {
            this.$toast("删除成功!");
            setTimeout(() => {
              this.getWgyList();
            }, 500);
          });
        })
        .catch(() => {});
    },
    // 二次确认删除
    deleteInfo() {
      Dialog.confirm({
        title: "确认删除",
        message: "确定要删除该渠道吗？",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "删除",
      }).then(async () => {
        var query = {
          yjToken: sessionStorage.getItem("yjToken"),
          ids: [this.routeQuery.channelId],
        };
        console.log(query, "请求参数");
        var encryData = this.getisEncParams(query);
        // 执行删除操作
        await this.$http(`delSamllRoadshowChannelInfoByIds`, {
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
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));
      this.$router.push({
        name: "addChannelVisit",
      });
    },
    getChannelList() {
      // 获取渠道走访列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelId: this.routeQuery.channelId,
        isDraft: "0",
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      this.$http(`querySamllRoadshowChannelInterByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.channelloading = false;
          this.channelTotal = resData.total;
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
        channelId: this.routeQuery.channelId,
        channelIdFz: "0", //"0-查询所属于该渠道 1-不属于任何渠道"
        isDraft: "0",
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(
        query,
        this.custpageIndex,
        this.custpageSize
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
          this.custTotal = resData.total;
          if (this.custpageIndex * this.custpageSize >= resData.total) {
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
    relateCust() {
      console.log("关联客户");
      sessionStorage.setItem(
        "dataInfo",
        JSON.stringify({
          ...this.dataInfo,
        })
      );
      this.$router.push({
        name: "custList",
        query: {
          type: "checkbox",
          name: "channelVisit",
        },
      });
    },
    getWgyList() {
      // 获取网格员列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelId: this.routeQuery.channelId,
        isDraft: "0",
      };
      console.log(query, "获取网格员列表");
      var encryData = this.getisEncParams(
        query,
        this.wgypageIndex,
        this.wgypageSize
      );
      this.$http(`querySamllRoadshowChannelWgyByPage`, {
        ...encryData.encryQuery,
        isEnc: 1,
      })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          // 判断是否 下一页
          this.wgyloading = false;
          this.wgyTotal = resData.total;
          if (this.wgypageIndex * this.wgypageSize >= resData.total) {
            this.wgyfinished = true;
          } else {
            this.wgyfinished = false;
          }
          this.wgyList =
            this.wgypageIndex == 1
              ? resData.list
              : this.wgyList.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    openMore(type) {
      sessionStorage.setItem("dataInfo", JSON.stringify(this.dataInfo));
      this.$router.push({
        name: type,
        query: {
          name: "channelDetail",
          channelId: this.routeQuery.channelId,
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
    max-height: 500px;
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
      .right {
        .btn {
          border-radius: 10px;
          color: #fff;
          font-size: 28px;
          line-height: 30px;
          padding: 15px 30px;
        }
        .btnBlue {
          background: #5176e0;
          margin-right: 10px;
        }
        .btnRed {
          background: #ee0a24;
        }
      }
    }
    .list-item:last-of-type {
      border: none;
    }
  }
}
</style>
