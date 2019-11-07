/* 
 * 服务器端入口
 */
import  { createApp } from "./app";
let isDev = process.env.NODE_ENV !== "product";

// 根据请求路由的变化来匹配响应的组件
export default context => {
    return new Promise((resolve, reject) => {
        let { app, router, store } = createApp();
        console.log("路由", context.url)
        const s = isDev && Date.now();
        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            console.log("是否匹配到路由", !!matchedComponents.length);
            // 如果没有匹配到请求的路由，返回错误编码
            if (!matchedComponents.length) {
                return reject({ code: 404 })
            }
  
            // 对所有匹配的路由组件调用 `asyncData()`
            Promise.all(matchedComponents.map(Component => {
                console.log("预取数据", Component.preFetch)
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    })
                }
                // if (component.preFetch) {
                //     return component.preFetch(store)
                // }
            })).then(() => {
                isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
                // 在所有预取钩子(preFetch hook) resolve 后，
                // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                // 当我们将状态附加到上下文，
                // 并且 `template` 选项用于 renderer 时，
                // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
                context.state = store.state
                //console.log("app");
                resolve(app)
            }).catch(reject)
        }, reject)
    })
}