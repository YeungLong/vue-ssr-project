const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, dir)
};

let baseUrl = "/";

module.exports = {
    mode: isProd?"production": 'development',
    devtool: isProd?false: '#cheap-module-source-map',
    entry: {
        app: "@/client-entry.js",
        "vendor-base": "@/vendors/vendor.base.js",
        "vendor-exten": "@/vendors/vendor.exten.js"
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: `${baseUrl}dist/`,
        //globalObject: 'this',
        filename: "[name].[hash].js",
        chunkFilename: "[name].[contenthash:8].js"
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [{
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            css: 'vue-style-loader!css-loader',
                            less: 'vue-style-loader!css-loader!less-loader',
                        },
                        compilerOptions: {
                            preserveWhitespace: false
                        }
                    }
                },
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
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
    plugins: isProd?[
        new VueLoaderPlugin()
    ]: [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin()
    ],
    resolve: {
        extensions: [".js", ".vue", ".css", ".less"],
        alias: {
            "vue": "vue/dist/vue.esm.js",
            "@": resolve("../src")
        }
    }
};
