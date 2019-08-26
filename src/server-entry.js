import  { createApp } from "./app";
console.log("服务端入口")
let isDev = process.env.NODE_ENV !== "product";

export default context => {
    return new Promise((resolve, reject) => {
        let { app, router, store } = createApp();
        console.log("路由", context.url)
        const s = isDev && Date.now();
        router.push(context.url);
        //let matchedComponents = router.getMatchedComponents();

        // if (!matchedComponents.length) {
        //     return Promise.reject({code: "404"})
        // };

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            console.log("hasRouter", matchedComponents.length);
            if (!matchedComponents.length) {
                return reject({ code: 404 })
            }
  
            // 对所有匹配的路由组件调用 `asyncData()`
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    })
                }
            })).then(() => {
                // 在所有预取钩子(preFetch hook) resolve 后，
                // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                // 当我们将状态附加到上下文，
                // 并且 `template` 选项用于 renderer 时，
                // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
                context.state = store.state
                //console.log("app");
                resolve(app)
            }).catch(reject)
            resolve(app);
        }, reject)
    })

    // return Promise.all(matchedComponents.map(component => {
    //     if (component.preFetch) {
    //         return component.preFetch(store)
    //     }
    // })).then(() => {
    //     isDev && console.log(`data pre-fetch: ${Date.now() - s}`);
    //     context.initialState = store.state;
    //     return app
    // })
}