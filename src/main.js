import Vue from "vue";
//导入请求框架
import router from "./router";
import "vant/lib/index.css";
import "@/utils/rem.js";
import "@/utils/common";
import global from "./utils/global";
import App from "./App.vue";
import store from "./vuex/store";
import "./components/index.js";
import http from "./services/http.js";
import http2 from "./services/http2.js";
import http3 from "./services/http3.js";
import httpfile from "./services/httpfile.js";
import Vconsole from "vconsole";
import "@/utils/reg.js";
import BaiduMap from 'vue-baidu-map';
import {
    Table,
    TableColumn,
    Pagination
} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'Vs12UlVg7EtQs7h0kbcwBerxZ7ycAfhC'
})
import {
    Tab,
    Tabs,
    Tag,
    Button,
    Popup,
    Picker,
    List,
    Search,
    DropdownMenu,
    DropdownItem,
    Field,
    Cell,
    CellGroup,
    DatetimePicker,
    Dialog,
    Cascader,
    Form,
    PullRefresh,
    Uploader,
    Empty,
    Calendar,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Icon,
    SwipeCell,
    Image,
    Collapse,
    CollapseItem,
    Step,
    Steps,
    Area,
} from "vant";
Vue.use(Tab)
    .use(Tabs)
    .use(Tag)
    .use(Button)
    .use(Popup)
    .use(Picker)
    .use(List)
    .use(Search)
    .use(DropdownMenu)
    .use(DropdownItem)
    .use(Form)
    .use(Field)
    .use(Cell)
    .use(CellGroup)
    .use(DatetimePicker)
    .use(Dialog)
    .use(Cascader)
    .use(PullRefresh)
    .use(Uploader)
    .use(Empty)
    .use(Calendar)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(Icon)
    .use(SwipeCell)
    .use(Image)
    .use(Collapse)
    .use(CollapseItem)
    .use(Step)
    .use(Steps)
    .use(Area);
Vue.use(Table).use(TableColumn).use(Pagination)
Vue.prototype.$http = http;
Vue.prototype.$http2 = http2;
Vue.prototype.$http3 = http3;
Vue.prototype.$httpfile = httpfile;

Vue.prototype.$global = global;
Vue.prototype.$getCode = (type, val) =>
    global[type].filter((item) => item.text == val)[0].code;
Vue.prototype.$getVal = (type, code) =>
    global[type].filter((item) => item.code == code)[0].text;

Vue.prototype.$getareaVal = (code) => {
    var province = code.substring(0, 2) + "0000";
    var city = code.substring(0, 4) + "00";
    var county = code.substring(0, 6);
    var provinceName = area.province_list[province] || "";
    var cityName = area.city_list[city] || "";
    var countyName = area.county_list[county] || "";
    return provinceName + cityName + countyName;
};
let vconsole = null;
if (process.env.NODE_ENV === "test") {
    vconsole = new Vconsole();
}
export default vconsole;

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0)
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

new Vue({
    router,
    store,
    ...App,
}).$mount("#app");
