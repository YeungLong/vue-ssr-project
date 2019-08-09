import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { sync } from "vuex-router-sync";
console.log(router)
sync(store, router);

let app = new Vue({
    router,
    store,
    ...App
});

export {app, router, store}