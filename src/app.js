import Vue from "vue";
import App from "./App.vue";
import { createStore } from "./store";
import { createRouter } from "./router";
import { sync } from "vuex-router-sync";

// 全局引用ElementUI组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
Vue.use(ElementUI);

// 封装网络请求，全局用$http引用
import request from "./server/request.js";
Vue.prototype.$http = request;


export function createApp() {
    let router = createRouter();
    let store = createStore();
    sync(store, router);

    let app = new Vue({
        router,
        store,
        render: (h) => h(App)
    });

    return  {app, router, store}
}