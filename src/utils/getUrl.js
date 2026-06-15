// 将连接后面的参数 对象化
export default function getQueryString(url) {
   var theRequest = {};
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
         //    decodeURI  乱码转中文
         theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
      }
   }
   return theRequest;
}