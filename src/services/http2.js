import Axios from "axios";
import Vue from "vue";
import { Toast } from "vant";
import global from "@/global";
import service from "./service.js";
Vue.use(Toast);
var axios = Axios.create({
  timeout: 60 * 5 * 1000,
  baseURL: global.proxyURL,
});
//请求时长15秒
// 多个请求地址时不适用
const showToast = (msg) => {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: msg,
  });
};
/**
 * @param {string} url api的key值 当多域名时直接传于完整链接
 * @param {object} data 请求参数,是作为请求体被发送的数据 get与post写法一致
 * @param {object} params 是与请求一起发送的 URL 参数 get与post写法一致
 * @param {string} msg toast提示信息 传入false时不显示 默认请求中,请稍候 非必填
 * @param {string} method 请求方法 get post 默认post非必填
 * @param {string} headers 请求头 非必填
 */
export default function http(url, data, params, method = "post") {
  // data.createTellerNo = this.$store.state.userId
  // data.createTellerNo = "20160728181"
  if (method == "post") {
    if (url.indexOf("?") != -1) {
      let arr = url.split("?");
      url = service.url(arr[0]);
      url += "?";
      url += arr[1];
    } else {
      url = service.url(url); //组装一下
    }
  } else {
    url = service.url(url); //组装一下
  }

  showToast("请求中,请稍候");
  // application/x-www-form-urlencoded  默认格式
  // application/json;charset=UTF-8
  return new Promise((resolve, reject) => {
    if (method === "get") {
      for (var key in data) {
        if (url.indexOf("?") <= 0) {
          url += "?";
        } else {
          url += "&";
        }
        url += key + "=" + data[key];
      }
    }
    let $chars =
      "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1";
    let maxPos = $chars.length;
    let req = "";
    for (let i = 0; i < 30; i++) {
      req += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    axios({
      //根据需求是否需要传递token 一般无需删除 后端不接收即可  token
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        userId: "roadshow",
        token: "321582000",
        reqNo: req,
      },
      url,
      method,
      params,
      data,
      responseType: "arraybuffer",
    })
      .then((res) => {
        Toast.clear();
        if (res.status == 200) {
          resolve(res.data);
        } else {
          Toast.fail(res.data.msg || res.data.message || "请求错误！");
          reject(res.data);
        }
      })
      .catch((err) => {
        Toast.clear();
        Toast.fail("请求错误，请联系管理员！");
      });
  });
}
