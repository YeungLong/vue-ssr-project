const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");

const path = require("path");

module.exports = webpackMerge(baseConfig, {
    output: {
        filename: "js/[name].[hash].js",
        path: path.resolve(__dirname, "../dist"),
    },
    devtool: "#@inline-source-map",
    mode: "development",
    module: {
        rules: []
    }
})