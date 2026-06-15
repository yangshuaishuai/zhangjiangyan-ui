import Vue from "vue";
import router from "./router";
import "vant/lib/index.css";
import "@/utils/rem.js";
import App from "./App.vue";
import store from "./vuex/store";
import BaiduMap from 'vue-baidu-map';

Vue.use(BaiduMap, {
    ak: 'Vs12UlVg7EtQs7h0kbcwBerxZ7ycAfhC'
});

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
    Form,
    PullRefresh,
    Uploader,
    Empty,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Icon,
    SwipeCell,
    Image,
    Collapse,
    CollapseItem,
    NavBar,
    Toast,
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
    .use(PullRefresh)
    .use(Uploader)
    .use(Empty)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(Icon)
    .use(SwipeCell)
    .use(Image)
    .use(Collapse)
    .use(CollapseItem)
    .use(NavBar)
    .use(Toast);

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
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
