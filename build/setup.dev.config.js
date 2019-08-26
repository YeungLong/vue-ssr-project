const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const MFS = require("memory-fs");
const chokidar = require("chokidar");
const clientConfig = require("./webpack.client.config");
const serverConfig = require("./webpack.server.config");

const readFile = (mfs, file) => {
    try {
        return mfs.readFileSync(path.join(clientConfig.output.path, file), "utf-8")
    } catch(e) {
        console.log(e)
    }
}

module.exports = function setupDevServer (app, templatePath, cb) {
    let bundle,
        template,
        clientManifest;

    let ready;
    let readyPromise = new Promise((r) => {
        ready = r;
    })
    let update = () => {
        if (bundle && clientManifest) {
            ready();
            console.log("回调")
            cb(bundle, {
                template,
                clientManifest,
                runInNewContext: false
            })
        }
    }
    //console.log(path.join(clientConfig.output.path, "index.html"))
    template = fs.readFileSync(templatePath, "utf-8");
    chokidar.watch(templatePath).on("change", () => {
        template = fs.readFileSync(templatePath, "utf-8");
        console.log("index.html template updated.");
        update();
    });
    //console.log(template)
    
    clientConfig.entry.app = ["webpack-hot-middleware/client", clientConfig.entry.app];
    clientConfig.output.filename = "[name].js";
    // console.log("服务端配置")
    // console.log(serverConfig);
    // console.log("浏览器端配置");
    // console.log(clientConfig)

    // del-middleware
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require("webpack-dev-middleware")(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        }
    });

    app.use(devMiddleware);
    clientCompiler.plugin("done", (stats) => {
        stats = stats.toJson();
        clientManifest = JSON.parse(readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json"));
        //console.log(clientManifest)
        update()
    })

    // hot-middleware
    app.use(require("webpack-hot-middleware")(clientCompiler));

    // watch and update server renderer
    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename);
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err;
        stats = stats.toJson();
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(warn => console.warn(warn));
        bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
        //console.log(bundle)
        update()
    })

    return readyPromise
}