const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = require("./webpack.base.config.js");
const package = require("../package.json");

let env = "development";

if (process.env.NODE_ENV === "product") {
    env = "production"
}

let config = webpackMerge(baseConfig, {
    plugins: [
        // 编译时可以配置的全局常量插件
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
            "process.env.VUE_ENV": '"client"',
        }),
        // 生成一个HTML文件的插件
        new HtmlWebpackPlugin({
            title: "VUE" + package.version + "工程",
            template: "./index.html",
            filename: "index.html",
            //inject: true
        }),
        new VueSSRClientPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.HashedModuleIdsPlugin(),
    ],
    // webpack 4.0版本替代CommonsChunkPlugin的配置
    optimization: {
        splitChunks: {
            // chunks: 'all',//默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
            // minSize: 30000,//合并前模块文件的体积
            name: "manifest",
            minChunks: Infinity,//最少被引用次数
            // maxAsyncRequests: 5,
            // maxInitialRequests: 3,
            // automaticNameDelimiter: '~',//自动命名连接符
            // cacheGroups: {
            //     vendors: {
            //         test: /[\\/]node_modules[\\/]/,
            //         minChunks:1,//敲黑板
            //         priority: -10//优先级更高
            //     },
            //     default: {
            //         test: /[\\/]src[\\/]js[\\/]/,
            //         minChunks: 2,//一般为非第三方公共模块
            //         priority: -20,
            //         reuseExistingChunk: true
            //     }
            // }
        },
        // runtimeChunk: {
        //     name: "server-bundle"
        // }
    },
})

if (process.env.NODE_ENV === "product") {
    // webpack 4.0版本替代ExtractTextPlugin的配置
    config.plugins.push(new MiniCssExtractPlugin({
          filename: 'styles.[contenthash:8].css'
        })
    );
    config.optimization.minimizer = [new UglifyJsPlugin()];
}
//console.log(config.plugins)
module.exports = config