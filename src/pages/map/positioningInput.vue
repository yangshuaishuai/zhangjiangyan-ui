<template>
  <div class="page">
    <div class="searchBox" v-if="addShow">
      <img src="../../assets/img/iconSearch.png" alt="" class="icon" />
      <input
        type="text"
        class="input"
        v-model="searchAddress"
        placeholder="请输入搜索地址"
      />
      <div class="btnSearch" @click="search">搜索</div>
    </div>

    <div class="topBox" v-if="searcShow">
      <div
        class="box"
        v-for="(item, index) in positionVOList"
        :key="index"
        @click="changePoisition(item)"
      >
        <div class="text1">{{ item.name }}</div>
        <div class="text2">{{ item.distance }}米以内 | {{ item.address }}</div>
      </div>
    </div>

    <baidu-map
      class="bm-view"
      :center="{ lng: lng, lat: lat }"
      :zoom="16"
      @dragend="draggingMap"
    >
      <bm-marker
        :position="markerPoint"
        :icon="{ url: image, size: { width: 35, height: 46 } }"
      ></bm-marker>
    </baidu-map>

    <div class="bottomBox" v-if="addShow">
      <!-- <div class="top" @click="showCity = true">
        <div class="text1">所在省市</div>
        <div class="text3">{{ province }}</div>
        <div class="text3">{{ city }}</div>
        <div class="text3">{{ district }}</div>
      </div> -->
      <!-- <div class="top">
        <van-field
          label="所在地区"
          v-model="fieldValue"
          placeholder="请选择所在地区"
          autosize
          rows="1"
          type="textarea"
          @click="cascaderShow = true"
        ></van-field>
      </div> -->

      <div class="bottom">
        <div style="display: flex; align-items: center">
          <van-field
            label="详细地址"
            v-model="address"
            placeholder="请输入详细地址"
            autosize
            rows="1"
            type="textarea"
          ></van-field>
        </div>
        <div style="display: flex; margin-top: 20px">
          <div class="address" @click="refreshPositionClient">
            <img src="../../assets/img/position.png" alt="" />
            <span>刷新定位</span>
          </div>
          <div class="btn" @click="toBack">确认定位</div>
        </div>
      </div>
    </div>

    <!-- 省市区 -->
    <van-popup v-model="showCity" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="confirmCity"
        @cancel="showCity = false"
        value="320000"
      />
    </van-popup>

    <!-- 所在地区 -->
    <van-popup v-model="cascaderShow" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="cascaderShow = false"
        @finish="onFinish"
        active-color="#5176E0"
        :field-names="fieldNames"
      />
    </van-popup>
  </div>
</template>
<script>
import { areaList } from "@vant/area-data";
import youjieMessage from "@/utils/youjieMessage";
export default {
  data() {
    return {
      image: require("@/assets/img/iconPosition.png"),
      lng: "",
      lat: "",
      markerPoint: {
        lng: "",
        lat: "",
      }, //百度地图
      province: "", //省
      city: "", //市
      district: "", //区
      address: "", //详细地址
      searchAddress: "", //搜索地址
      positionVOList: [], //搜索地址列表
      searcShow: false, //搜索弹框
      addShow: false,
      showCity: false,
      areaList, // 数据格式见 Area 组件文档
      cascaderShow: false,
      fieldValue: "",
      cascaderValue: "",
      options: [],
      fieldNames: {
        text: "region",
        value: "regionCode",
        children: "children",
      },
    };
  },
  created() {
    console.log(this.$route.query);
    if (this.$route.query.status == "error") {
      this.lng = this.$route.query.lng;
      this.lat = this.$route.query.lat;
      this.markerPoint.lng = this.$route.query.lng;
      this.markerPoint.lat = this.$route.query.lat;
      this.$dialog
        .alert({
          message: "邮捷定位失败! 请手动搜索地址定位!",
          confirmButtonColor: "#5176E0",
        })
        .then(() => {
          // on close
          this.addShow = true;
        });
      return;
    }
    this.addShow = true;
    this.lng = this.$route.query.lng;
    this.lat = this.$route.query.lat;
    this.markerPoint.lng = this.$route.query.lng;
    this.markerPoint.lat = this.$route.query.lat;
    this.province = this.$route.query.province;
    this.city = this.$route.query.city;
    this.district = this.$route.query.district;
    this.address = this.$route.query.address;
    this.getQueryCsByLocate();
  },
  methods: {
    getQueryCsByLocate() {
      this.$http3("queryCsByLocate", {
        province: this.province,
        city: this.city,
        district: this.district,
      }).then((res) => {
        console.log(res);
        // 只获取街道不需要村委会
        res.data.map((item) => {
          delete item.children;
        });
        this.options = res.data;
      });
    },
    onFinish({ selectedOptions }) {
      console.log(selectedOptions);
      this.cascaderShow = false;
      this.fieldValue = selectedOptions
        .map((option) => option.region)
        .join("/");
    },
    confirmCity(ev) {
      this.showCity = false;
      // 设置名称
      this.cityName = ev[0].name + "," + ev[1].name + "," + ev[2].name;
      this.province = ev[0].name;
      this.city = ev[1].name;
      this.district = ev[2].name;
      this.getQueryCsByLocate();
      this.fieldValue = "";
    },
    toBack() {
      if (!this.address) {
        this.$toast("请输入详细地址");
        return;
      }
      var dataInfo = JSON.parse(sessionStorage.getItem("dataInfo"));
      dataInfo.interviewAddress = this.address;
      console.log(dataInfo, "--****---");
      // 为了反显图片暂存走访信息获取走访id
      if (this.$route.query.name == "addCustVisit" && !dataInfo.interviewId) {
        //   是新增客户走访
        dataInfo.yjToken = sessionStorage.getItem("yjToken");
        dataInfo.isDraft = "1";
        var encryData = this.getisEncParams(dataInfo);
        this.$http("saveOrUpdateSamllRoadshowCustomerInterview", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            if (res.code == "0") {
              dataInfo.interviewId = res.message;
              sessionStorage.setItem("dataInfo", JSON.stringify(dataInfo));
              this.$router.go(-1);
            }
          })
          .catch(() => {
            console.log("请求失败");
          });
      } else if (
        this.$route.query.name == "addChannelVisit" &&
        !dataInfo.channelInterId
      ) {
        // 是新增渠道走访
        dataInfo.yjToken = sessionStorage.getItem("yjToken");
        dataInfo.isDraft = "1";
        var encryData = this.getisEncParams(dataInfo);
        this.$http("saveOrUpdateSamllRoadshowChannelInter", {
          ...encryData.encryQuery,
          isEnc: 1,
        })
          .then((res) => {
            if (res.code == "0") {
              dataInfo.channelInterId = res.message;
              sessionStorage.setItem("dataInfo", JSON.stringify(dataInfo));
              this.$router.go(-1);
            }
          })
          .catch(() => {
            console.log("请求失败");
          });
      } else {
        sessionStorage.setItem("dataInfo", JSON.stringify(dataInfo));
        this.$router.go(-1);
      }
    },

    changePoisition(e) {
      console.log(e);
      this.searcShow = false;
      this.province = e.province;
      this.city = e.city;
      this.district = e.district;
      this.address = e.address;
      this.lng = e.longitude;
      this.lat = e.latitude;
      this.markerPoint.lng = e.longitude;
      this.markerPoint.lat = e.latitude;
      this.getQueryCsByLocate();
    },
    search() {
      if (this.$route.query.status == "error") {
        this.city = "江苏省";
      }
      this.$http3("suggestByAddress", {
        address: this.searchAddress,
        city: this.city,
        longitude: this.markerPoint.lng,
        latitude: this.markerPoint.lat,
      }).then((res) => {
        if (res.code == 0) {
          this.searcShow = true;
          this.positionVOList = res.data.positionVOList;
        } else {
          this.$toast(res.message);
        }
      });
    },
    draggingMap(e) {
      console.log(e);
      this.markerPoint = e.target.getCenter();

      this.$http3("coordinateToAddress", {
        longitude: e.point.lng,
        latitude: e.point.lat,
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.province = res.data.province;
          this.city = res.data.city;
          this.district = res.data.district;
          this.address = res.data.address;
          this.fieldValue = "";
          this.cascaderValue = "";
          this.getQueryCsByLocate();
        } else {
          this.$toast(res.message);
        }
      });
    },
    refreshPositionClient() {
      if (this.$store.state.client == "xinchuang") {
        this.refreshPositionYL();
      } else {
        this.refreshPosition();
      }
    },
    refreshPosition() {
      // 邮捷定位方法
      let geolocation = requireModuleJs("geolocation");
      if (!geolocation) {
        this.$dialog
          .alert({
            message: "邮捷定位失败! 请手动搜索地址定位!",
            confirmButtonColor: "#5176E0",
          })
          .then(() => {});
        return;
      }
      geolocation.get((ret) => {
        console.log(ret);
        if (ret.latitude) {
          this.$http3("coordinateConversion", {
            longitude: ret.longitude,
            latitude: ret.latitude,
            conversionFrom: "1",
            conversionTo: "5",
          }).then((res) => {
            console.log(res);
            // latitude = res.data.targetLatitude
            // longitude = res.data.targetLongitude

            this.lng = res.data.targetLongitude;
            this.lat = res.data.targetLatitude;
            this.markerPoint.lng = res.data.targetLongitude;
            this.markerPoint.lat = res.data.targetLatitude;

            this.$http3("coordinateToAddress", {
              longitude: this.lng,
              latitude: this.lat,
            }).then((res) => {
              console.log(res);
              if (res.code == 0) {
                this.province = res.data.province;
                this.city = res.data.city;
                this.district = res.data.district;
                this.address = res.data.address;
                this.fieldValue = "";
                this.getQueryCsByLocate();
              } else {
                this.$toast(res.message);
              }
            });
          });
        } else {
          this.$dialog
            .alert({
              message: "邮捷定位失败! 请手动搜索地址定位!",
              confirmButtonColor: "#5176E0",
            })
            .then(() => {
              // on close
            });
          return;
        }
      });
    },
    refreshPositionYL() {
      // 邮连定位方法
      youjieMessage
        .postMessageToParent("getLocationInfo")
        .then((result) => {
          if (result.success) {
            console.log("触发成功:", result.data);

            if (result.data.code == "00") {
              this.$http3("coordinateConversion", {
                longitude: result.data.data.lng,
                latitude: result.data.data.lat,
                conversionFrom: "3",
                conversionTo: "5",
              }).then((res) => {
                console.log(res);
                this.lng = res.data.targetLongitude;
                this.lat = res.data.targetLatitude;
                this.markerPoint.lng = res.data.targetLongitude;
                this.markerPoint.lat = res.data.targetLatitude;

                this.$http3("coordinateToAddress", {
                  longitude: this.lng,
                  latitude: this.lat,
                }).then((res) => {
                  console.log(res);
                  if (res.code == 0) {
                    this.province = res.data.province;
                    this.city = res.data.city;
                    this.district = res.data.district;
                    this.address = res.data.address;
                    this.fieldValue = "";
                    this.getQueryCsByLocate();
                  } else {
                    this.$toast(res.message);
                  }
                });
              });
            } else {
              this.$dialog
                .alert({
                  message: "邮捷定位失败! 请手动搜索地址定位!",
                  confirmButtonColor: "#5176E0",
                })
                .then(() => {});
            }
          } else {
            console.error("触发失败:", result.error, "11111");
            this.$dialog
              .alert({
                message: "邮捷定位失败! 请手动搜索地址定位!",
                confirmButtonColor: "#5176E0",
              })
              .then(() => {});
          }
        })
        .catch((e) => {
          console.error("触发失败:", e, "22222");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100vw;
  min-height: 100vh;
  background: #f7f7f7;

  .bm-view {
    width: 100%;
    height: 100vh;
  }
}

.searchBox {
  width: 710px;
  height: 86px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 99;
  display: flex;
  align-items: center;

  .icon {
    width: 26px;
    height: 26px;
    margin: 0 20px;
  }

  .input {
    border: 0;
    width: 550px;
  }

  .btnSearch {
    // width: 64px;
    height: 32px;
    font-size: 32px;
    font-weight: 500;
    color: #5176e0;
    line-height: 32px;
  }
}

.topBox {
  width: 710px;
  height: 454px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  position: absolute;
  top: 116px;
  left: 20px;
  z-index: 99;
  overflow-y: auto;

  .box {
    margin-left: 30px;
    border-bottom: 1px solid #f7f7f7;
    width: 650px;
  }

  .text1 {
    // height: 32px;
    font-size: 32px;
    font-weight: 500;
    color: #393c3f;
    // line-height: 32px;
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .text2 {
    // height: 32px;
    font-size: 28px;
    font-weight: 400;
    color: #99a0af;
    // line-height: 32px;
    padding-bottom: 30px;
  }
}

.bottomBox {
  width: 710px;
  // height: 431px;
  background: #ffffff;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 99;
  padding-bottom: 30px;

  .top {
    display: flex;
    align-items: center;
    margin-top: 40px;
    margin-left: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #f7f7f7;
    width: 650px;
    ::v-deep .van-cell {
      padding: 0;
      .van-field__label {
        margin: 0;
      }
    }

    .text1 {
      white-space: nowrap;
      height: 30px;
      font-size: 30px;
      font-weight: 400;
      color: #696c77;
      line-height: 30px;
      margin-right: 50px;
    }

    .text2 {
      height: 28px;
      font-size: 28px;

      font-weight: 500;
      color: #99a0af;
      line-height: 28px;
      margin-right: 20px;
    }

    .text3 {
      // height: 28px;
      font-size: 28px;

      font-weight: 500;
      color: #000;
      // line-height: 28px;
      margin-right: 20px;
    }
  }

  .bottom {
    margin-top: 40px;
    margin-left: 30px;
    ::v-deep .van-cell {
      padding: 0;
      .van-field__label {
        margin: 0;
      }
    }
    .text1 {
      height: 28px;
      font-size: 28px;
      font-weight: 400;
      color: #696c77;
      line-height: 28px;
      margin-right: 50px;
    }

    .input {
      border: 0px;
      width: 403px;
      margin-right: 33px;
    }

    .icon {
      width: 44px;
      height: 45px;
    }
  }
}

.address {
  width: 186px;
  height: 90px;
  background: rgba(81, 118, 224, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #5176e0;
  // margin-left: 170px;
  margin-left: 0;
  margin-right: 20px;
  // margin-top: 40px;

  img {
    width: 20px;
    height: 28px;
    margin-right: 10px;
  }
}

.btn {
  width: 444px;
  height: 90px;
  background: #5176e0;
  line-height: 90px;

  border-radius: 12px;
  background: #5176e0;
  text-align: center;
  margin-right: 30px;

  color: #ffffff;
  // margin-top: 30px;
}

/deep/ .anchorBL {
  display: none;
}
</style>
