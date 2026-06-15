<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="keyWord"
        placeholder="请输入网格员名称"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <van-list
      v-model="wgyloading"
      :finished="wgyfinished"
      finished-text="没有更多了"
      @load="onLoadwgy"
      :immediate-check="false"
      offset="50"
    >
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
    </van-list>
    <div style="height: 100px"></div>
    <div class="footer">
      <div class="btns">
        <van-button
          class="btn"
          type="info"
          plain
          @click="goBack"
          color="#5176E0"
          >返回</van-button
        >
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
export default {
  data() {
    return {
      keyWord: "",
      routeQuery: {},
      // 渠道列表
      wgyList: [],
      wgyloading: false,
      wgyfinished: false,
      wgypageIndex: 1,
      wgypageSize: 15,
      editWgyShow: false, //编辑网格员弹框
      wgyInfo: {}, //网格员表单信息
      wgyorgNamePopup: false, //网格员网点弹框
      wgyorgNameList: [], //网格员网点
      wgyIndex: "", //选中的网格员下标
    };
  },
  created() {
    this.routeQuery = this.$route.query;
    this.getWgyList();
    this.getwgyOrgInfo();
  },
  methods: {
    onLoadwgy() {
      if (this.wgyList.length > 0) {
        this.wgypageIndex += 1;
        this.getWgyList();
      }
    },
    getWgyList() {
      // 获取网格员列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelId: this.routeQuery.channelId,
        isDraft: "0",
        keyWord: this.keyWord,
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
    onSearch() {
      this.wgypageIndex = 1;
      this.wgyList = [];
      this.getWgyList();
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
      var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      var upInstId = dataInfo.orgId ? dataInfo.orgId : dataInfo.upOrgId;
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
                console.log(res, "789");
                this.$toast("修改成功!");
                setTimeout(() => {
                  this.onSearch();
                }, 500);
                done();
              })
              .catch((err) => {
                console.log(err, "错误");
                done(false);
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
      this.$dialog
        .confirm({
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
              this.onSearch();
            }, 500);
          });
        })
        .catch(() => {});
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.pages {
  width: 100%;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100%;
  .van-list {
    flex: 1;
    height: 0;
    overflow-y: auto;
    .list-item {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px;
      background: #fff;
      border-radius: 18px;
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