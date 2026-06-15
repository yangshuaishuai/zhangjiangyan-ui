import Vue from "vue";
import VueRouter from "vue-router";
const home = () => import("@/pages/home.vue");

const index = () => import("@/pages/index.vue");
const submitsuccess = () => import("@/pages/submitSuccess.vue");
const editActiveInfo = () => import("@/pages/editActiveInfo.vue");
const editCustInfo = () => import("@/pages/editCustInfo.vue");
const editChannelInfo = () => import("@/pages/editChannelInfo.vue");
const activeDetail = () => import("@/pages/activeDetail.vue");
const custDetail = () => import("@/pages/custDetail.vue");
const channelDetail = () => import("@/pages/channelDetail.vue");
const custVisitDetail = () => import("@/pages/custVisitDetail.vue");
const channelVisitDetail = () => import("@/pages/channelVisitDetail.vue");
const cbDetail = () => import("@/pages/cbDetail.vue");
const editCbInfo = () =>
    import("@/pages/editCbInfo.vue");

const activeList = () => import("@/pages/list/activeList.vue");
const channelList = () => import("@/pages/list/channelList.vue");
const custList = () => import("@/pages/list/custList.vue");
const wgyList = () => import("@/pages/list/wgyList.vue");

const editWgyInfo = () => import("@/pages/editWgyInfo.vue");
const addChannelVisit = () => import("@/pages/addChannelVisit.vue");
const addCustVisit = () => import("@/pages/addCustVisit.vue");

const positioningInput = () => import("@/pages/map/positioningInput.vue");

// 辅助页面
const channelVisitList = () => import("@/pages/assist/channelVisitList.vue");
const channelWGYList = () => import("@/pages/assist/channelWGYList.vue");
const custVisitList = () => import("@/pages/assist/custVisitList.vue");
const relateChannelList = () => import("@/pages/assist/relateChannelList.vue");
const relateCustList = () => import("@/pages/assist/relateCustList.vue");
const ssml = () => import("@/pages/assist/ssml.vue");


// 不需要页面
const custVistList = () => import("@/pages/list/custVistList.vue");

Vue.use(VueRouter);
const routes = [

    {
        path: "/home",
        name: "home",
        component: home,
        meta: {
            title: "所属场景",
        },
    },
    {
        path: "/",
        name: "index",
        component: index,
        meta: {
            title: "首页",
        },
    },

    {
        path: "/submitsuccess",
        component: submitsuccess,
        name: "submitsuccess",
        meta: { title: "提交成功" },
    },
    {
        path: "/editActiveInfo",
        component: editActiveInfo,
        name: "editActiveInfo",
        meta: {
            title: "路演信息登记",
        },
    },
    {
        path: "/editCustInfo",
        component: editCustInfo,
        name: "editCustInfo",
        meta: {
            title: "客户信息登记",
        },
    },
    {
        path: "/editChannelInfo",
        component: editChannelInfo,
        name: "editChannelInfo",
        meta: {
            title: "渠道信息登记",
        },
    },
    {
        path: "/activeDetail",
        component: activeDetail,
        name: "activeDetail",
        meta: {
            title: "路演信息详情",
        },
    },
    {
        path: "/custDetail",
        component: custDetail,
        name: "custDetail",
        meta: {
            title: "客户信息详情",
        },
    },
    {
        path: "/channelDetail",
        component: channelDetail,
        name: "channelDetail",
        meta: {
            title: "渠道信息详情",
        },
    },
    {
        path: "/custVisitDetail",
        component: custVisitDetail,
        name: "custVisitDetail",
        meta: {
            title: "客户走访详情",
        },
    },
    {
        path: "/channelVisitDetail",
        component: channelVisitDetail,
        name: "channelVisitDetail",
        meta: {
            title: "渠道走访详情",
        },
    },
    {
        path: "/cbDetail",
        component: cbDetail,
        name: "cbDetail",
        meta: {
            title: "储备客户详情",
        },
    },
    {
        path: "/editCbInfo",
        component: editCbInfo,
        name: "editCbInfo",
        meta: {
            title: "编辑储备客户信息",
        },
    },
    {
        path: "/activeList",
        component: activeList,
        name: "activeList",
        meta: {
            title: "路演列表",
        },
    },
    {
        path: "/channelList",
        component: channelList,
        name: "channelList",
        meta: {
            title: "渠道列表",
        },
    },
    {
        path: "/custList",
        component: custList,
        name: "custList",
        meta: {
            title: "客户列表",
        },
    },
    {
        path: "/custVistList",
        component: custVistList,
        name: "custVistList",
        meta: {
            title: "关联客户列表",
        },
    },
    {
        path: "/wgyList",
        component: wgyList,
        name: "wgyList",
        meta: {
            title: "网格员列表",
        },
    },
    {
        path: "/editWgyInfo",
        component: editWgyInfo,
        name: "editWgyInfo",
        meta: {
            title: "编辑网格员信息",
        },
    },
    {
        path: "/addChannelVisit",
        component: addChannelVisit,
        name: "addChannelVisit",
        meta: {
            title: "新增渠道走访",
        },
    },
    {
        path: "/addCustVisit",
        component: addCustVisit,
        name: "addCustVisit",
        meta: {
            title: "新增客户走访",
        },
    },
    {
        path: "/positioningInput",
        component: positioningInput,
        name: "positioningInput",
        meta: {
            title: "",
        },
    },
    // 辅助页面
    {
        path: "/channelVisitList",
        component: channelVisitList,
        name: "channelVisitList",
        meta: {
            title: "渠道走访列表",
        },
    },
    {
        path: "/channelWGYList",
        component: channelWGYList,
        name: "channelWGYList",
        meta: {
            title: "网格员列表",
        },
    },
    {
        path: "/custVisitList",
        component: custVisitList,
        name: "custVisitList",
        meta: {
            title: "客户走访列表",
        },
    },
    {
        path: "/relateChannelList",
        component: relateChannelList,
        name: "relateChannelList",
        meta: {
            title: "渠道列表",
        },
    },
    {
        path: "/relateCustList",
        component: relateCustList,
        name: "relateCustList",
        meta: {
            title: "客户列表",
        },
    },
    {
        path: "/ssml",
        component: ssml,
        name: "ssml",
        meta: { title: "客户移交" },
    },
];
const router = new VueRouter({
    routes,
    mode: "hash", //default: hash ,history
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {
                x: 0,
                y: 0,
            };
        }
    },
});

// 解决跳转当前路由报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch((err) => err);
};
export default router;
