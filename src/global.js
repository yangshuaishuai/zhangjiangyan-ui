var proxyURL, BASEURL;
if (process.env.NODE_ENV === "development") {
  //开发环境
  proxyURL = "http://20.147.170.3:9125/roadshow/";
} else if (process.env.NODE_ENV === "test") {
  //测试环境
  proxyURL = "https://jstest.91betterwei.com/jgwl/roadshow/roadshow/";
  BASEURL = 'https://jstest.91betterwei.com/'
} else {
  //正式环境
  proxyURL = "https://wap.jiangsu.psbc.com/jgwl/roadshow/roadshow/";
  BASEURL = "https://wap.jiangsu.psbc.com/"
}
export default {
  proxyURL,
};
