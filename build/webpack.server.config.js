const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js");

let env = (process.env.NODE_ENV === "product")?"production": "development";

module.exports = webpackMerge(baseConfig, {
    target: "node",
    devtool: false,
    entry: "./src/server-entry.js",
    output: {
        // publicPath: "vue/dist",
        filename: "server-bundle.js",
        // chuckFilename: "js/[name].[hash:6].js",
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: []
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
            "process.env.VUE_ENV": '"server"'
        })
    ],
    externals: Object.keys(require('../package.json').dependencies),
})