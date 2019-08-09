const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js");
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
let env = (process.env.NODE_ENV === "product")?"production": "development";

module.exports = webpackMerge(baseConfig, {
    target: "node",
    //devtool: false,
    entry: "./src/server-entry.js",
    output: {
        filename: "server-bundle.js",
        libraryTarget: 'commonjs2' // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
            "process.env.VUE_ENV": '"server"'
        }),
        //new VueSSRServerPlugin()
    ],
    externals: Object.keys(require('../package.json').dependencies),
})