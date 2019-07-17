import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import app from "./modules/app";
import user from "./modules/user";

const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    action: {

    },
    modules: {
        app,
        user
    }
});

export default store