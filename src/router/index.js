import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);



export function createRouter() {
    return new Router({
        //mode: "history",
        base: "/",
        routes: [{
            path: "/",
            name: "index",
            title: "首页",
            component: () => import("../views/example/index.vue")
        }, 
        // {
        //     path: "/store",
        //     name: "store",
        //     title: "数据存储",
        //     component: () => import("@/views/store/index.vue")
        // }, {
        //     path: "/mock",
        //     name: "mock",
        //     title: "数据生成",
        //     component: () => import("@/views/mock/index.vue")
        // }, 
        {
            path: '*', 
            redirect: '/'
        }
        ]
    })
    // router.beforeEach((to, from, next) => {
    //     next()
    // })
    
    // router.afterEach(() => {
    //     window.scrollTo(0, 0)
    // })
}