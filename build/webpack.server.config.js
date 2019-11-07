const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const baseConfig = require("./webpack.base.config.js");

let env = (process.env.NODE_ENV === "product")?"production": "development";

module.exports = webpackMerge(baseConfig, {
    target: "node",
    devtool: '#source-map',
    entry: "@/server-entry.js",
    output: {
        filename: "server-bundle.js",
        libraryTarget: 'commonjs2' // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    },
    module: {
        rules: [
          {
            test: /\.styl(us)?$/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader'
              },
              'stylus-loader'
            ],
          },
          {
            test: /\.(le|c)ss$/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader'
              },
              'less-loader',
            ],
          }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
            "process.env.VUE_ENV": '"server"'
        }),
        new VueSSRServerPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ],
    externals: Object.keys(require('../package.json').dependencies),
})