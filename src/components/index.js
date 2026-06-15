// public 下的.vue文件 自动注册

import Vue from "vue";

const componentsContext = require.context("./", true, /\.vue$/);

componentsContext.keys().forEach((component) => {
  const componentConfig = componentsContext(component);
  // 兼容import export和require module.export两种规范
  const ctrl = componentConfig.default || componentConfig;
  // 加载全局组件
  if (ctrl && ctrl.name) {
    Vue.component(ctrl.name, ctrl);
    // Vue.component('myComponent',{render(){return <h1>hello world</h1>}});
  }
});
