const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
    return path.join(__dirname, dir)
};

let baseUrl = "/";

module.exports = {
    mode: 'development',
    devtool: '#source-map',
    entry: {
        app: "@/client-entry.js",
        "vendor-base": "@/vendors/vendor.base.js",
        "vendor-exten": "@/vendors/vendor.exten.js"
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: `${baseUrl}dist/`,
        filename: "[name].js"
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [{
                test: /\.vue$/,
                //use: 'vue-loader',
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: 'vue-style-loader!css-loader',
                            less: 'vue-style-loader!css-loader!less-loader'
                        },
                        postLoaders: {
                            html: 'babel-loader'
                        }
                    }
                }]
        }, 
        {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
        }, 
        // {
        //     test: /\.js[x]$/,
        //     //loader: "babel-loader",
        //     use: [{
        // 　　　　loader: 'babel-loader',//cnpm i -D babel-loader @babel/core @babel/preset-env webpack
        // 　　　　options: {//npm i -S babel-polyfill 实现浏览器对不支持API的兼容（兼容旧环境、填补）
        // 　　　　　　presets: ['@babel/preset-env']
        // 　　　　}
        // 　　}],
        //     include: [resolve("src")],
        //     exclude: /node_modules/
        // },
         {
            test: /\.css$/,
            use: [
                //"vue-style-loader",
                "style-loader",
        　　 　　"css-loader"
       　　 ]
        }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }, {
            test: /\.(jpe?g|png|gif)(\?.*)?$/,
            loader: "url-loader",
            options: {
                limit: 1024,
                name: "images/[name].[ext]"
            }
        }, {
            test: /\.(woff2|eot|ttf|otf|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: "fonts/[name].[ext]"
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: "media/[name].[ext]"
            }
        }, {
            test: /\.(html|tpl)$/,
            loader: "html-loader"
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        // 解决vender后面的hash每次都改变
        //new webpack.HashedModuleIdsPlugin(),
    ],
    resolve: {
        extensions: [".js", ".vue", ".css", ".less"],
        alias: {
            "vue": "vue/dist/vue.esm.js",
            "@": resolve("../src")
        }
    }
};