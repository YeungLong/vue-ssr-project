import  {app, router, store} from "./app";
console.log("服务端入口")
let isDev = process.env.NODE_ENV !== "product";

export default context => {
    console.log("路由")
    const s = isDev && Date.now();
    router.push(context.url);
    let matchedComponents = router.getMatchedComponents();

    if (!matchedComponents.length) {
        return Promise.reject({code: "404"})
    }

    return Promise.all(matchedComponents.map(component => {
        if (component.preFetch) {
            return component.preFetch(store)
        }
    })).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}`);
        context.initialState = store.state;
        return app
    })
}