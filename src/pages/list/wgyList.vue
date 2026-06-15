<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-model="keyWord"
        placeholder="请输入网格员姓名"
        show-action
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <div class="btns">
        <div></div>
        <div class="btn" @click="gotoAddCust">
          <img src="../../assets/img/addIcon.png" alt="" />
          <span>新建</span>
        </div>
      </div>
    </div>
    <van-list
      v-model="wgyloading"
      :finished="wgyfinished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
    >
      <!-- 单选 -->
      <van-radio-group v-model="radio">
        <div class="radioItem" v-for="(item, index) in wgyList" :key="index">
          <van-radio :name="item">
            <div class="list-item">
              <div class="left">
                <span class="title">
                  {{ item.wgyName }}
                  <span v-if="item.wgyPhone">({{ item.wgyPhone }})</span>
                </span>
                <span class="text">职务：{{ item.wgyPost }}</span>
              </div>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
    </van-list>
    <div style="height: 70px"></div>
    <div class="footer">
      <div class="btns">
        <van-button
          class="btn"
          native-type="button"
          type="info"
          block
          @click="confirm"
          color="#5176E0"
          >确定</van-button
        >
      </div>
    </div>
    <!-- 新增网格员 -->
    <!-- 网格员网点 -->
    <van-dialog
      v-model="editWgyShow"
      title="新增网格员信息"
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
          :rules="[{ required: false, message: '请输入手机号' }]"
        >
        </van-field>
      </van-form>
    </van-dialog>
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
      wgyList: [],
      wgyloading: false,
      wgyfinished: false,
      wgypageIndex: 1,
      wgypageSize: 10,
      total: "", //总数
      radio: "",
      routeQuery: {}, //跳转参数
      name: "", //跳转前的
      editWgyShow: false, //编辑网格员弹框
      wgyInfo: {}, //网格员表单信息
      wgyorgNamePopup: false, //网格员网点弹框
      wgyorgNameList: [], //网格员网点
    };
  },
  created() {
    if (this.$route.query.type == "allInfo") {
      var dataInfo = JSON.parse(sessionStorage.getItem("khdataInfo"));
    } else {
      var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
    }
    this.routeQuery = dataInfo;
    this.name = this.$route.query.name;
    this.getWgyList();
    this.getwgyOrgInfo();
  },
  methods: {
    gotoAddCust() {
      this.editWgyShow = true;
    },
    async getWgyList() {
      // 获取网格员列表
      var query = {
        yjToken: sessionStorage.getItem("yjToken"),
        channelId: this.routeQuery.channelId,
        isDraft: "0",
        keyWord: this.keyWord,
      };
      console.log(query, "请求参数");
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
    onLoad() {
      if (this.wgyList.length > 0) {
        this.wgypageIndex += 1;
        this.getWgyList();
      }
    },
    confirm() {
      // 单选
      if (!this.radio) {
        this.$toast("请选择客户");
        return;
      }
      this.routeQuery.wgyName = this.radio.wgyName;
      this.routeQuery.wgyPhone = this.radio.wgyPhone;
      this.routeQuery.wgyEfInstId = this.radio.wgyEfInstId;
      this.routeQuery.wgyEfInstName = this.radio.wgyEfInstName;
      this.routeQuery.wgyPost = this.radio.wgyPost;
      this.routeQuery.channelWgyId = this.radio.channelWgyId;

      if (this.$route.query.type == "allInfo") {
        sessionStorage.setItem("khdataInfo", JSON.stringify(this.routeQuery));
      } else {
        sessionStorage.setItem("dataInfo", JSON.stringify(this.routeQuery));
      }

      this.$router.replace({
        name: this.name,
      });
    },
    // 网格员网点
    async getwgyOrgInfo() {
      var upInstId = this.routeQuery.orgId
        ? this.routeQuery.orgId
        : this.routeQuery.upOrgId;
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
            this.wgyInfo.channelId = this.routeQuery.channelId;
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
                this.$toast("新增成功!");
                this.wgyInfo = {}; //网格员表单信息
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
    onwgyConfirm(e) {
      console.log(e);
      this.wgyInfo.wgyEfInstName = e.instName;
      this.wgyInfo.wgyEfInstId = e.instId;
    },
  },
};
</script>
<style lang="less" scoped>
.pages {
  // min-height: 100%;
  width: 100%;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100%;
  .top {
    .btns {
      width: 100%;
      box-sizing: border-box;
      text-align: right;
      padding: 20px 20px 0;
      display: flex;
      justify-content: space-between;
      .btn {
        color: #fff;
        padding: 20px;
        border-radius: 33px;
        background: #5176e0;
        display: flex;
        align-items: center;
        width: 186px;
        height: 66px;
        box-sizing: border-box;
        justify-content: center;
        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
      }
    }
  }
  .van-list {
    flex: 1;
    height: 0;
    overflow-y: auto;
    .radioItem {
      display: flex;
      padding: 0px 20px;
      margin: 20px;
      background: #fff;
      flex: 1;
      border-radius: 18px;
      .van-radio,
      .van-checkbox {
        width: 100%;
      }
    }
    .list-item {
      padding: 30px;
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
          padding-top: 10px;
          color: #99a0af;
          font-size: 26px;
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