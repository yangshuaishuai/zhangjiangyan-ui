import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        active: 0,
        visitType: 1,
        proxyURL: "",
        BASEURL: "",
        client: "youjie",
        searchObj: {
            keyWord: "",
            cjName: "", //搜索场景名称
            channelTypeName: "", //渠道名称
            efInstName: "", //网点机构号
            khjlUserName: "", //客户经理
            custPhone: "", //客户手机号
        },//搜索项
    },
    mutations: {
        // 通过下面方法变更state的值，严格模式下就不会报错
    },
    actions: {},
    modules: {}
});


