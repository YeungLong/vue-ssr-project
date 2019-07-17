process.env.VUE_ENV = "server"

const isPord = process.env.NODE_ENV === "product";

const fs = require("fs");
const http = require("http");
const path = require("path");
const express = require("express");
const LRU = require("lru-cache");
const favicon = require("serve-favicon");
const compression = require("compression");
const serialize = require("serialize-javascript");
const proxy = require("http-proxy-middleware");
const cookieParser = require("cookie-parser");
const resolve = file => path.resolve(__dirname, file);

const app = express();

let baseUrl = "/";
let portUrl = 'http://test.yeung.com/';

let indexHtml
let renderer

if (isPord) {
    indexHtml = parseIndex(fs.readFileSync("./dist/index.html"), "utf-8");
    renderer = createRenderer(fs.readFileSync("./dist/main.js"), "utf-8");
} else {
    require("./build/setup.dev.config")(app, {
        buildUpdated: bundle => {
            renderer = createRenderer(bundle)
        },
        indexUpdated: index => {
            indexHtml = parseIndex(index)
        }
    })
}

function createRenderer (bundle) {
  // https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

function parseIndex (template) {
  const contentMarker = '<!-- APP -->'
  const i = template.indexOf(contentMarker)
  return {
    head: template.slice(0, i),
    tail: template.slice(i + contentMarker.length)
  }
}

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isPord ?  60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0}));
app.use(cookieParser());
app.use(`${baseUrl}dist`, serve("./dist"));

app.get(`${baseUrl}*`, (req, res) => {
    if (!renderer) {
        return res.end("'waiting for compilation... refresh in a moment.")
    }
    //console.log(indexHtml)
    //console.log(renderer)
    res.setHeader("Content-type", "text/html");
    let s = Date.now();
    console.log("请求url", req.url)
    let context = {url: req.url, cookies: req.cookies};
    // 渲染我们的Vue实例作为流
    let renderStream = renderer.renderToStream(context);
    //console.log(8888)
    
    // 当块第一次被渲染时
    renderStream.once("data", () => {
        // 将预先的HTML写入响应
        //console.log(65656)
        //console.log(indexHtml.head)
        res.write(indexHtml.head);
    })
    //console.log(renderStream)
    // 每当新的块被渲染
    renderStream.on("data", chunk => {
        res.write(chunk)
    })
    // 当所有的块被渲染完成
    renderStream.on("end", () => {
        // 当vuex初始状态存在
        if (context.initialState) {
            res.write(`<script>window.__INITIAL_STATE__=${
                serialize(context.initialState, { isJSON: true })
                }</script>`
            )
        };

        res.end(indexHtml.tail);
        console.log(`whole request: ${Date.now() - s}`)
    })
    // 当渲染出错时
    renderStream.on("error", err => {
        if (err && err.code === '404') {
            res.status(404).end('404 | Page Not Found')
        }
        res.status(500).end("Internal Error 500");
    })
})

const port = process.env.port || 8089;
app.listen(port, () => {
    console.log(`server started at localhost: ${port}`)
})

