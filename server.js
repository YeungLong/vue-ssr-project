process.env.VUE_ENV = "server";

const isProd = process.env.NODE_ENV === "product";

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


let renderer
let readyPromise
const templatePath = resolve("./index.html");
if (process.BROWSER_BUILD) {
  require('external_library')
}
if (isProd) {
    let template = fs.readFileSync(templatePath, "utf-8");
    let clientManifest = require("./dist/vue-srr-client-manifest.json");
    let bundle = require("./dist/vue-srr-server-bundle.json");
    renderer = createRenderer(bundle, {template, clientManifest});
} else {
    readyPromise = require("./build/setup.dev.config")(app, templatePath, (bundle, options) => {
        renderer = createRenderer(bundle, options);
        //console.log("ssr", renderer);
    })
}

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, Object.assign(options, {
    basedir: resolve("./dist"),
    runInNewContext: false,
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  }))
}

function parseIndex (template) {
  const contentMarker = '<!-- APP -->';
  const i = template.indexOf(contentMarker);
  return {
    head: template.slice(0, i),
    tail: template.slice(i + contentMarker.length)
  }
}

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ?  60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0}));
app.use(cookieParser());
app.use(`${baseUrl}dist`, serve("./dist"));


function render(req, res) {
    // if (!renderer) {
    //     return res.end("'waiting for compilation... refresh in a moment.")
    // }
    console.log("开始渲染")
    res.setHeader("Content-Type", "text/html");
    let s = Date.now();
    console.log("请求url", req.url)
    let context = {url: req.url, cookies: req.cookies};
    // 渲染我们的Vue实例作为流
    //console.log(renderer)
    renderer.renderToString(context, (err, html) => {
        console.log("err", err);
        //console.log("html", html);
        if (err) {
          if (err && err.code === '404') {
              res.status(404).end('404 | Page Not Found')
          } else {
            res.status(500).end("Internal Error 500");
          }
        }
        res.send(html)
        console.log(`whole request: ${Date.now() - s}`)
    });
}

app.get(`${baseUrl}*`, isProd?render: (req, res) => { 
        readyPromise.then(() => {
            render(req, res)
        })
    }
);

const port = process.env.PORT || 8089;
app.listen(port, () => {
    console.log(`server started at localhost: ${port}`)
})

