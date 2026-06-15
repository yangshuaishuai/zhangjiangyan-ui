import Vue from "vue";
import VueRouter from "vue-router";

// 个金部一体化营销
const pfHome = () => import("@/pages/pf/pfHome.vue");
const pfCompanyList = () => import("@/pages/pf/pfCompanyList.vue");
const pfCompanyDetail = () => import("@/pages/pf/pfCompanyDetail.vue");
const pfEditCompany = () => import("@/pages/pf/pfEditCompany.vue");
const pfCustomerList = () => import("@/pages/pf/pfCustomerList.vue");
const pfCustomerDetail = () => import("@/pages/pf/pfCustomerDetail.vue");
const pfEditCustomer = () => import("@/pages/pf/pfEditCustomer.vue");
const pfEditReserveCustomer = () => import("@/pages/pf/pfEditReserveCustomer.vue");
const pfAddCustomerVisit = () => import("@/pages/pf/pfAddCustomerVisit.vue");
const pfCustomerVisitDetail = () => import("@/pages/pf/pfCustomerVisitDetail.vue");
const pfAddCompanyVisit = () => import("@/pages/pf/pfAddCompanyVisit.vue");
const pfCompanyVisitDetail = () => import("@/pages/pf/pfCompanyVisitDetail.vue");

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/pfHome",
    },
    // 个金部一体化营销
    {
        path: "/pfHome",
        component: pfHome,
        name: "pfHome",
        meta: { title: "个金部一体化营销" },
    },
    {
        path: "/pfCompanyList",
        component: pfCompanyList,
        name: "pfCompanyList",
        meta: { title: "公司列表" },
    },
    {
        path: "/pfCompanyDetail",
        component: pfCompanyDetail,
        name: "pfCompanyDetail",
        meta: { title: "公司详情" },
    },
    {
        path: "/pfEditCompany",
        component: pfEditCompany,
        name: "pfEditCompany",
        meta: { title: "编辑公司信息" },
    },
    {
        path: "/pfCustomerList",
        component: pfCustomerList,
        name: "pfCustomerList",
        meta: { title: "客户列表" },
    },
    {
        path: "/pfCustomerDetail",
        component: pfCustomerDetail,
        name: "pfCustomerDetail",
        meta: { title: "客户信息详情" },
    },
    {
        path: "/pfEditCustomer",
        component: pfEditCustomer,
        name: "pfEditCustomer",
        meta: { title: "编辑客户信息" },
    },
    {
        path: "/pfEditReserveCustomer",
        component: pfEditReserveCustomer,
        name: "pfEditReserveCustomer",
        meta: { title: "储备客户信息编辑" },
    },
    {
        path: "/pfAddCustomerVisit",
        component: pfAddCustomerVisit,
        name: "pfAddCustomerVisit",
        meta: { title: "客户走访登记" },
    },
    {
        path: "/pfCustomerVisitDetail",
        component: pfCustomerVisitDetail,
        name: "pfCustomerVisitDetail",
        meta: { title: "客户走访详情" },
    },
    {
        path: "/pfAddCompanyVisit",
        component: pfAddCompanyVisit,
        name: "pfAddCompanyVisit",
        meta: { title: "公司走访登记" },
    },
    {
        path: "/pfCompanyVisitDetail",
        component: pfCompanyVisitDetail,
        name: "pfCompanyVisitDetail",
        meta: { title: "公司走访详情" },
    },
];

const router = new VueRouter({
    routes,
    mode: "hash",
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
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
