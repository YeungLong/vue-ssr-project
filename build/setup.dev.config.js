const path = require("path");
const webpack = require("webpack");
const MFS = require("memory-fs");
const clientConfig = require("./webpack.client.config");
const serverConfig = require("./webpack.server.config");

module.exports = function setupDevServer (app, opts) {
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
    clientCompiler.plugin("done", () => {
        let fs = devMiddleware.fileSystem;
        let filePath = path.join(clientConfig.output.path, "index.html");
        if (fs.existsSync(filePath)) {
            const index = fs.readFileSync(filePath, "utf-8");
            opts.indexUpdated(index);
        }
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
        let build = mfs.readFileSync(outputPath, "utf-8");
        opts.buildUpdated(build);
    })
}