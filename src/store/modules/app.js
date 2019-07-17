import Vue from 'vue';

const state = {
    clientHeight: window && window.document.documentElement.clientHeight
                  ?window.document.documentElement.clientHeight: window.body.clientHeight,
};

const getters = {
    clientHeight: state => state.clientHeight,
};

const actions = {
    
};

const mutations = {

};

export default {
    state,
    getters,
    actions,
    mutations
}