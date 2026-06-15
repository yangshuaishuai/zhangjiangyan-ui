<template>
  <div class="pages">
    <div class="top">
      <van-search
        v-if="active != '4' && active != '3' && active != '1'"
        v-model="searchObj.keyWord"
        :placeholder="placeholder"
        show-action
        @search="onSearch"
      >
        <template #left>
          <van-search
            class="cJsearch"
            v-model="searchObj.cjName"
            placeholder="请输入场景名称"
            @search="onSearch"
          >
          </van-search>
        </template>
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <div class="moreBox" v-else style="height: 54px; padding: 10px 12px">
        <div class="leftBox" @click="moreChoose = true">
          <img src="../assets/img/choose.png" alt="" class="choose" />
          筛选
          <img src="../assets/img/bottomArrow.png" alt="" class="bottomArrow" />
        </div>
      </div>
      <!-- 更多筛选 -->
      <van-popup
        v-model="moreChoose"
        position="bottom"
        style="max-height: 80%"
        @close="moreChooseConfirm"
      >
        <div class="pxText">请选择筛选条件</div>
        <div>
          <div class="searchItem">
            <div class="pxTitle">场景名称</div>
            <van-search
              v-model="searchObj.cjName"
              class="px-item"
              placeholder="请输入场景名称"
            ></van-search>
          </div>
          <div class="searchItem">
            <div class="pxTitle">{{ placeholder }}</div>
            <van-search
              v-model="searchObj.keyWord"
              class="px-item"
              :placeholder="`请输入${placeholder}`"
            ></van-search>
          </div>
          <div class="searchItem" v-if="!(active == '3' && visitType == '0')">
            <div class="pxTitle">渠道名称</div>
            <van-search
              v-model="searchObj.channelTypeName"
              class="px-item"
              placeholder="请输入渠道名称"
            ></van-search>
          </div>
          <div class="searchItem" v-if="active == '4'">
            <div class="pxTitle">机构名称</div>
            <van-search
              v-model="searchObj.efInstName"
              class="px-item"
              placeholder="请输入机构名称"
            ></van-search>
          </div>
          <div class="searchItem" v-if="active == '4'">
            <div class="pxTitle">客户经理</div>
            <van-search
              v-model="searchObj.khjlUserName"
              class="px-item"
              placeholder="请输入客户经理"
            ></van-search>
          </div>
          <div class="searchItem" v-if="!(active == '3' && visitType == '0')">
            <div class="pxTitle">客户手机号</div>
            <van-search
              v-model="searchObj.custPhone"
              class="px-item"
              placeholder="请输入客户手机号"
            ></van-search>
          </div>
        </div>
        <div class="searchBottom">
          <div class="resetting" @click="moreChooseResetting">重置</div>
          <div class="confirm" @click="moreChoose = false">确认</div>
        </div>
      </van-popup>
      <van-tabs
        v-model="active"
        color="#5176e0"
        title-active-color="#393b3f"
        title-inactive-color="#99a0af"
        @change="tabChange"
      >
        <!-- <van-tab title="场景" name="5"></van-tab> -->
        <van-tab title="路演" name="0"></van-tab>
        <van-tab title="渠道" name="2"></van-tab>
        <van-tab title="客户" name="1"></van-tab>
        <van-tab title="走访" name="3"></van-tab>
        <van-tab title="储备" name="4"></van-tab>
      </van-tabs>
      <div class="btns" v-if="active == '0' || active == '1' || active == '2'">
        <div class="left" v-if="active == '1'">
          <van-dropdown-menu active-color="#5176e0">
            <van-dropdown-item
              v-model="custVal"
              :options="options"
              @change="wgyCheckedChange"
            />
          </van-dropdown-menu>
        </div>
        <div v-else></div>
        <div class="btn" @click="newAdd">
          <img src="../assets/img/addIcon.png" alt="" />
          <span>新建</span>
        </div>
      </div>
      <div class="btns" v-if="active == '3'">
        <div class="left" v-if="visitType == '1'">
          <van-dropdown-menu active-color="#5176e0">
            <van-dropdown-item
              v-model="cbVal"
              :options="cboptions"
              @change="cbCheckedChange"
            />
          </van-dropdown-menu>
        </div>
        <div v-else></div>
        <van-tabs
          type="card"
          v-model="visitType"
          color="#5176e0"
          @change="visitTabChange"
        >
          <van-tab title="客户走访" name="1"></van-tab>
          <van-tab title="渠道走访" name="0"></van-tab>
        </van-tabs>
      </div>
    </div>
    <van-list
      v-if="active != 5"
      ref="dataListTable"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
    >
      <van-swipe-cell v-for="(item, index) in dataLists" :key="index">
        <list-item
          @goPreview="goPreview(item)"
          @cbStatusDetail="cbStatusDetail(item)"
          @addVisit="addVisit(item)"
          @transferCustomer="transferCustomer(item)"
          :dataItem="item"
          :cbStatusList="cbStatusList"
          :type="active"
          :visitType="visitType"
          :channelInterviewTypeList="channelInterviewTypeList"
          :custInterviewTypeList="custInterviewTypeList"
        />
        <template #right v-if="active != '5' && active != '2'">
          <van-button
            style="height: 100%"
            square
            text="删除"
            type="danger"
            @click="delItem(item, index)"
          />
        </template>
      </van-swipe-cell>
    </van-list>
    <report-table
      v-else
      :tableData="dataLists"
      :total="total"
      :pageIndex="pageIndex"
      @onLoad="onLoad"
    ></report-table>
    <van-dialog
      v-model="cbStatusShow"
      title="储备信息"
      show-cancel-button
      :before-close="cbStatusbeforeClose"
    >
      <van-form
        class="detail"
        input-align="right"
        :show-error-message="false"
        label-width="40%"
        ref="cbform"
      >
        <van-field
          input-align="right"
          :value="getVal(dataInfo.cbStatus, cbStatusList)"
          is-link
          rows="1"
          autosize
          type="textarea"
          readonly
          name="cbStatus"
          label="储备状态"
          placeholder="请选择储备状态"
          @click="cbStatusShowPopup = true"
          required
          :rules="[{ required: true, message: '请选择储备状态' }]"
        />
        <!-- <van-field
          label="储备金额（万元）"
          v-model="dataInfo.cbMoney"
          name="cbMoney"
          placeholder="请输入储备金额"
          input-align="right"
          type="number"
          :rules="[{ pattern, required: true, message: '请输入储备金额' }]"
          required
        >
        </van-field> -->
      </van-form>
    </van-dialog>
    <!-- 储备状态 -->
    <van-popup v-model="cbStatusShowPopup" position="bottom">
      <van-picker
        show-toolbar
        value-key="dictName"
        :columns="cbStatusList"
        @confirm="
          cbStatusShowPopup = false;
          onConfirm($event, 'cbStatus');
        "
        @cancel="cbStatusShowPopup = false"
      ></van-picker>
    </van-popup>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      pattern: /^(\d+(\.\d{1,2})?)$/,
      yjToken: sessionStorage.getItem("yjToken"),
      active: "",
      visitType: "", //0渠道走访 1客户走访
      custVal: "", //是否未绑定网格员 0未绑定网格员  1绑定网格员
      options: [
        {
          text: "全部",
          value: "",
        },
        {
          text: "未绑定网格员",
          value: "0",
        },
        {
          text: "已绑定网格员",
          value: "1",
        },
      ],
      cbVal: "", //是否未绑定网格员 //0-是 1-否
      cboptions: [
        {
          text: "全部",
          value: "",
        },
        {
          text: "已储备",
          value: "0",
        },
        {
          text: "未储备",
          value: "1",
        },
      ],
      searchObj: {
        keyWord: "",
        cjName: "", //搜索场景名称
        custPhone: "", //客户手机号
        khjlUserName: "", //客户经理
        channelTypeName: "", //渠道名称
        efInstName: "", //网点机构号
      },
      placeholder: "路演名称",
      moreChoose: false, //更多筛选
      dataLists: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0, //总数
      custBelongTiaoxianList: [], //客户条线
      channelInterviewTypeList: [], //渠道走访-走访人员类型
      custInterviewTypeList: [], //客户走访-走访人员类型
      actPublicityChannelList: [], //路演活动表-宣传渠道
      mainTiaoxianList: [], //活动主要条线
      cbStatusList: [], //审批状态
      cbStatusShow: false, //审批弹框
      cbStatusShowPopup: false, //储备状态弹框
      dataInfo: {
        cbStatus: "",
        cbMoney: "",
      },
      oldcbStatus: "", //初始储备状态
      oldcbMoney: "", //初始储备金额
      hkSourceList: [], //获客来源
      custSxList: [], //客户属性
      customerTypeList: [], //客户类型
      productNameList: [], //产品名称
      channelDevRoleList: [], //渠道开发人角色
      thInstIdList: [], //其他市分行
    };
  },
  created() {
    this.searchObj = this.$store.state.searchObj;
    console.log(this.$store.state.searchObj, this.searchObj, "searchObj");
    sessionStorage.removeItem("dataInfo");
    sessionStorage.removeItem("khdataInfo");
    sessionStorage.removeItem("qddataInfo");
    sessionStorage.removeItem("custIsCb");
    this.active = this.$store.state.active;
    console.log(
      this.$store.state.active,
      this.active,
      "this.$store.state.active"
    );
    this.visitType = this.$store.state.visitType;
    console.log(this.visitType, "---");
    if (process.env.NODE_ENV === "development") {
      let url =
        "yjToken=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzeXNhZG1pbiIsImNsaWVudCI6InlvdWppZV9hcHAiLCJleHAiOjE3ODA2NjQyMzcsImNyZWF0ZWQiOjE3ODA2MjEwMzc0NjQsImF1dGhvcml0aWVzIjpudWxsfQ.Si72hm1hW5wWMm0kpW52EDBjQfA532-FscxoBmetFESqAM58l7S5E9oB2HNadHZ6KyKRdMAoWJJ3-RaCCjRVug";
      let param = qs.parse(url);
      sessionStorage.setItem("yjToken", param.yjToken);
      this.yjToken = param.yjToken;
    } else {
      // 根据加密的值去获取用户信息
      this.getyjToken();
    }
    if (!this.yjToken) {
      this.$toast("用户信息获取失败");
      return;
    }
    this.getUserInfo();
    // 客户条线
    this.getDicData(
      "SAMLL_ROADSHOW_CUSTOMER_CUST_BELONG_TIAOXIAN",
      "custBelongTiaoxianList"
    );
    // 渠道走访-走访人员类型
    this.getDicData(
      "SAMLL_ROADSHOW_CHANNEL_INTER_INTERVIEW_TYPE",
      "channelInterviewTypeList"
    );
    //客户走访-走访人员类型
    this.getDicData(
      "SAMLL_ROADSHOW_CUSTOMER_INTERVIEW_INTERVIEW_TYPE",
      "custInterviewTypeList"
    );

    //路演活动表-宣传渠道
    this.getDicData(
      "SAMLL_ROADSHOW_ACT_INFO_ACT_PUBLICITY_CHANNELS",
      "actPublicityChannelList"
    );
    // 储备状态
    this.getDicData(
      "SAMLL_ROADSHOW_CUSTOMER_CB_INFO_CB_STATUS",
      "cbStatusList"
    );

    // 获客来源
    this.getDicData("SAMLL_ROADSHOW_CUSTOMER_HK_SOURCE", "hkSourceList");
    // 客户属性
    this.getDicData("SAMLL_ROADSHOW_CUSTOMER_CUST_SX", "custSxList");
    // 客户类型
    this.getDicData(
      "SAMLL_ROADSHOW_CUSTOMER_CUSTOMER_TYPE",
      "customerTypeList"
    );
    // 产品名称
    this.getDicData(
      "SAMLL_ROADSHOW_CB_CUSTOMER_PRODUCT_NAME",
      "productNameList"
    );
    // 渠道开发人角色
    this.getDicData("SAMLL_ROADSHOW_CHANNEL_DEV_ROLE", "channelDevRoleList");
    // 其他市分行
    this.getDicData("EF_INST_INFO", "thInstIdList");
  },
  mounted() {
    this.getList();
  },
  watch: {
    active(newVal) {
      if (this.active == 0) {
        this.placeholder = "路演名称";
      } else if (this.active == 1) {
        this.placeholder = "客户名称";
      } else if (this.active == 2) {
        this.placeholder = "渠道名称";
      } else if (this.active == 3) {
        if (this.visitType == 0) {
          this.placeholder = "渠道名称";
        } else {
          this.placeholder = "客户名称";
        }
      } else if (this.active == 4) {
        this.placeholder = "客户/产品/企业名称";
      } else if (this.active == 5) {
        this.placeholder = "";
      }
    },
    visitType(newVal) {
      if (this.active == 3) {
        if (this.visitType == 0) {
          this.placeholder = "渠道名称";
        } else {
          this.placeholder = "客户名称";
        }
      }
    },
  },
  methods: {
    getyjToken() {
      // 获取yjToken
      let yjToken = sessionStorage.getItem("yjToken");
      let url = decodeURIComponent(location.search.replace(/^\?{1}/, ""));
      let param = this.$route.query;
      if (!this.isHave(param.yjToken)) {
        param = qs.parse(url);
      }
      if (!this.isHave(yjToken)) {
        sessionStorage.setItem("yjToken", param.yjToken);
        this.yjToken = param.yjToken;
      } else {
        this.yjToken = yjToken;
      }
    },
    // 获取用户信息
    getUserInfo() {
      var encryData = this.getisEncParams({ yjToken: this.yjToken });
      this.$http(`queryLoginUserInfo`, { ...encryData.encryQuery, isEnc: 1 })
        .then((res) => {
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "用户信息");
          // "isKhjl": "是否客户经理 0-是 1-否"
          sessionStorage.setItem("userInfo", JSON.stringify(resData));
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    async getList() {
      var url = "";
      var query = {
        yjToken: this.yjToken,
        keyWord: this.searchObj.keyWord,
        cjName: this.searchObj.cjName,
      };
      if (this.active == 0) {
        url = "querySamllRoadshowActInfoByPage";
      } else if (this.active == 1) {
        url = "querySamllRoadshowCustomerByPage";
        // 0未绑定网格员  1绑定网格员
        query.channelWgyIdFz = this.custVal;
        query.custIsCb = 1; //0-是 1-否
        query.custPhone = this.searchObj.custPhone;
        query.channelTypeName = this.searchObj.channelTypeName;
      } else if (this.active == 2) {
        url = "querySamllRoadshowChannelInfoByPage";
      } else if (this.active == 3) {
        if (this.visitType == 0) {
          url = "querySamllRoadshowChannelInterByPage";
        } else {
          query.custPhone = this.searchObj.custPhone;
          url = "querySamllRoadshowCustomerInterviewByPage";
          query.custIsCb = this.cbVal; //0-是 1-否
          query.channelTypeName = this.searchObj.channelTypeName;
        }
      } else if (this.active == 4) {
        url = "querySamllRoadshowCustomerByPage";
        query.custIsCb = 0; //0-是 1-否
        query.khjlUserName = this.searchObj.khjlUserName;
        query.efInstName = this.searchObj.efInstName;
        query.custPhone = this.searchObj.custPhone;
        query.channelTypeName = this.searchObj.channelTypeName;
      } else if (this.active == 5) {
        url = "querySamllRoadshowCjInfoByPage";
        query.parentId = "0";
      }
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query, this.pageIndex, this.pageSize);
      await this.$http(`${url}`, { ...encryData.encryQuery, isEnc: 1 })
        .then((res) => {
          // 对数据进行解密
          var resData = this.getisDecData(res.data, encryData.key);
          console.log(resData, "解密后数据");
          this.total = resData.total;
          if (this.active == 1) {
            resData.list.map((item) => {
              item.custBelongTiaoxianText = this.getVal(
                item.custBelongTiaoxian,
                this.custBelongTiaoxianList
              );
            });
          } else if (this.active == 3 && this.visitType == 0) {
            resData.list.map((item) => {
              item.interviewTypeText = this.getVal(
                item.interviewType,
                this.channelInterviewTypeList
              );
            });
          } else if (this.active == 3 && this.visitType == 1) {
            resData.list.map((item) => {
              item.interviewTypeText = this.getVal(
                item.interviewType,
                this.custInterviewTypeList
              );
            });
          }
          // 判断是否 下一页
          this.loading = false;
          if (this.pageIndex * this.pageSize >= resData.total) {
            this.finished = true;
          } else {
            this.finished = false;
          }
          this.dataLists =
            this.pageIndex == 1
              ? resData.list
              : this.dataLists.concat(resData.list);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
    },
    moreChooseResetting() {
      this.pageIndex = 1;
      this.searchObj = {
        keyWord: "",
        cjName: "", //搜索场景名称
        channelTypeName: "", //渠道名称
        efInstName: "", //网点机构号
        khjlUserName: "", //客户经理
        custPhone: "", //客户手机号
      };
      this.$store.state.searchObj = this.searchObj;
      //   this.moreChoose = false;
      //   this.getList();
    },
    moreChooseConfirm() {
      this.moreChoose = false;
      this.onSearch();
    },
    onSearch() {
      this.pageIndex = 1;
      this.dataLists = [];
      this.getList();
    },
    tabChange(e) {
      this.dataLists = [];
      this.$store.state.active = e;
      // tab切换时滚动条置顶
      // var element = document.getElementsByClassName("van-list")[0];
      // element.scrollTo(0, 0);

      this.pageIndex = 1;
      this.searchObj = {
        keyWord: "",
        cjName: "", //搜索场景名称
        channelTypeName: "", //渠道名称
        efInstName: "", //网点机构号
        khjlUserName: "", //客户经理
        custPhone: "", //客户手机号
      };
      this.$store.state.searchObj = this.searchObj;
      this.getList();
    },
    visitTabChange(e) {
      this.dataLists = [];
      this.$store.state.visitType = e;
      // 走访类型切换
      console.log(this.active, this.visitType, "777");
      this.pageIndex = 1;
      this.searchObj = {
        keyWord: "",
        cjName: "", //搜索场景名称
        channelTypeName: "", //渠道名称
        efInstName: "", //网点机构号
        khjlUserName: "", //客户经理
        custPhone: "", //客户手机号
      };
      this.$store.state.searchObj = this.searchObj;
      this.$nextTick(() => {
        if (this.$refs.dataListTable) {
          const elemt =
            this.$refs.dataListTable.$el || this.$refs.dataListTable;
          elemt.scrollTo(0, 0);
        }
      });

      this.getList();
    },
    newAdd() {
      if (this.active == 0) {
        // 新建活动
        this.$router.push({
          path: "/editActiveInfo",
        });
      } else if (this.active == 1) {
        // 新建客户
        this.$router.push({
          path: "/editCustInfo",
        });
      } else if (this.active == 2) {
        // 新建渠道
        this.$router.push({
          path: "/editChannelInfo",
        });
      }
    },
    wgyCheckedChange(e) {
      console.log(e, this.custVal);
      this.onSearch();
    },
    cbCheckedChange(e) {
      console.log(e, this.cbVal);
      this.onSearch();
    },
    goPreview(item) {
      if (this.active == 0) {
        // 活动详情
        this.$router.push({
          path: "/activeDetail",
          query: { actInfoId: item.actInfoId },
        });
      } else if (this.active == 1) {
        // 客户详情
        this.$router.push({
          path: "/custDetail",
          query: { custId: item.custId },
        });
      } else if (this.active == 2) {
        // 渠道详情
        this.$router.push({
          path: "/channelDetail",
          query: { channelId: item.channelId },
        });
      } else if (this.active == 3) {
        if (this.visitType == 0) {
          // 渠道走访详情
          this.$router.push({
            path: "/channelVisitDetail",
            query: {
              channelId: item.channelId,
              channelInterId: item.channelInterId,
            },
          });
        } else {
          // 客户走访详情
          this.$router.push({
            path: "/custVisitDetail",
            query: {
              interviewId: item.interviewId,
              custId: item.custId,
            },
          });
        }
      } else if (this.active == 4) {
        // 客户详情
        this.$router.push({
          path: "/cbDetail",
          query: { custId: item.custId },
        });
      } else if (this.active == 5) {
        // 客户详情
        console.log("场景详情");
      }
    },
    addVisit(item) {
      // 新增走访
      if (this.visitType == "1") {
        sessionStorage.setItem("custIsCb", item.custIsCb);
        console.log(item, "客户新增走访");
        this.$router.push({
          name: "addCustVisit",
          query: {
            custId: item.custId,
            type: "allInfo",
          },
        });
      } else if (this.visitType == "0") {
        console.log(item, "渠道新增走访");
        this.$router.push({
          name: "addChannelVisit",
          query: {
            channelId: item.channelId,
            type: "allInfo",
          },
        });
      }
    },
    transferCustomer(item) {
      // 移交
      this.$dialog
        .confirm({ title: "客户移交", message: "确定要发起客户移交吗？" })
        .then(() => {
          this.$router.push({
            name: "ssml",
            query: {
              custId: item.custId,
            },
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    cbStatusDetail(item) {
      this.cbStatusShow = true;
      this.oldcbStatus = item.cbStatus;
      this.oldcbMoney = item.cbMoney;
      this.dataInfo = {
        cbStatus: item.cbStatus,
        cbMoney: item.cbMoney,
        custId: item.custId,
      };
    },
    cbStatusbeforeClose(action, done) {
      if (action == "cancel") {
        done();
      } else {
        this.$refs.cbform
          .validate()
          .then((res) => {
            if (
              this.dataInfo.cbStatus == this.oldcbStatus &&
              this.dataInfo.cbMoney == this.oldcbMoney
            ) {
              this.dataInfo.cbType = "0";
            } else {
              this.dataInfo.cbType = "1";
            }
            this.dataInfo.yjToken = sessionStorage.getItem("yjToken");
            // 检验储备金额
            if (this.dataInfo.cbMoney) {
              if (!this.pattern.test(this.dataInfo.cbMoney)) {
                done(false);
                this.$toast("请输入正确的储备金额");
                return;
              }
            }
            var encryData = this.getisEncParams(this.dataInfo);
            this.$http(`saveOrUpdateSamllRoadshowCustomerCbInfo`, {
              ...encryData.encryQuery,
              isEnc: 1,
            })
              .then((res) => {
                done();
                this.onSearch();
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
    onConfirm(e, type) {
      console.log(e, type);
      if (type == "cbStatus") {
        this.dataInfo.cbStatus = e.dictId;
      }
    },
    onLoad(currentPage) {
      if (!currentPage) {
        if (this.dataLists.length > 0) {
          this.pageIndex += 1;
          this.getList();
        }
      } else {
        // 场景展示表格
        this.dataLists = [];
        this.pageIndex = currentPage;
        this.getList();
      }
    },
    delItem(item, i) {
      console.log(item, i, "删除表单");
      var url, query, id;
      if (this.active == 0) {
        url = "delSamllRoadshowActInfoByIds";
        id = item.actInfoId;
      } else if (this.active == 1) {
        url = "delSamllRoadshowCustomerByIds";
        id = item.custId;
      } else if (this.active == 2) {
        url = "delSamllRoadshowChannelInfoByIds";
        id = item.channelId;
      } else if (this.active == 3) {
        if (this.visitType == 0) {
          url = "delSamllRoadshowChannelInterByIds";
          id = item.channelInterId;
        } else {
          url = "delSamllRoadshowCustomerInterviewByIds";
          id = item.interviewId;
        }
      } else if (this.active == 4) {
        url = "delSamllRoadshowCustomerByIds";
        id = item.custId;
      }
      query = {
        yjToken: this.yjToken,
        ids: [id],
      };
      console.log(query, "请求参数");
      var encryData = this.getisEncParams(query);
      this.$http(`${url}`, { ...encryData.encryQuery, isEnc: 1 })
        .then((res) => {
          this.$toast.success(res.message);
          this.dataLists.splice(i, 1);
        })
        .catch((err) => {
          console.log(err, "错误");
        });
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
    .cJsearch {
      padding: 0;
      margin-right: 10px;
      width: 45%;
    }
    ::v-deep .van-field__left-icon {
      display: none;
    }
    .moreBox {
      box-sizing: border-box;
      .leftBox {
        width: 190px;
        height: 66px;
        background: #ffffff;
        border-radius: 12px;
        font-size: 26px;
        font-weight: 500;
        color: #393b3f;
        display: flex;
        align-items: center;
        justify-content: center;
        .bottomArrow {
          width: 14px;
          height: 8px;
          margin-left: 11px;
        }

        .choose {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
      }
    }
    // 展开更多筛选
    .pxText {
      height: 28px;
      font-size: 28px;
      font-weight: 400;
      color: #99a0af;
      line-height: 28px;
      padding: 50px 40px;
    }
    .searchItem {
      padding: 0 40px;
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
      .pxTitle {
        height: 28px;
        font-size: 28px;
        font-weight: 500;
        color: #393b3f;
        line-height: 28px;
        margin-bottom: 20px;
      }
      .px-item {
        padding: 0;
        flex: 1;
      }
    }
    .searchBottom {
      display: flex;
      margin-left: 30px;
      margin-bottom: 20px;
      .resetting {
        font-size: 30px;
        font-weight: 400;
        color: #393b3f;
        line-height: 30px;
        padding: 30px 45px;
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #dedede;
        margin-right: 20px;
        flex-shrink: 0;
      }
      .confirm {
        height: 30px;
        font-size: 30px;
        font-weight: 400;
        color: #ffffff;
        line-height: 30px;
        padding: 30px 230px;
        background: #5176e0;
        border-radius: 12px;
        flex-shrink: 0;
      }
    }
  }
  .van-list {
    flex: 1;
    height: 0;
    overflow-y: auto;
  }
  .btns {
    width: 100%;
    height: 86px;
    box-sizing: border-box;
    text-align: right;
    padding: 20px 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      ::v-deep .van-dropdown-menu__bar {
        border-radius: 10px;
        padding: 15px;
        height: auto;
        width: 250px;
      }
    }
  }
  .btn {
    color: #fff;
    padding: 20px;
    border-radius: 33px;
    background: #5176e0;
    display: flex;
    align-items: center;
    width: 186px;
    box-sizing: border-box;
    justify-content: center;
    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }
}
</style>
