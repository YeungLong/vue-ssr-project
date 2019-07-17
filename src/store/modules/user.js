import Vue from 'vue';

const state = {
    userInfo: {}
};

const getters = {
    userInfo: state => state.userInfo,
};

const actions = {
    
};

const mutations = {
    setUserInfo(state, obj) {
        //console.log(state)
        console.log(obj)
        state.userInfo = obj;
        console.log(state)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}