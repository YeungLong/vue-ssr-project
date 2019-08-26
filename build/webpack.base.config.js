const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, dir)
};

let baseUrl = "/";

module.exports = {
    mode: isProd?"production": 'development',
    devtool: isProd?false: '#source-map',
    entry: {
        app: "@/client-entry.js",
        "vendor-base": "@/vendors/vendor.base.js",
        "vendor-exten": "@/vendors/vendor.exten.js"
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: `${baseUrl}dist/`,
        filename: "[name].[chunkhash].js"
    },
    module: {
        //noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [{
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            css: 'vue-style-loader!css-loader',
                            less: 'vue-style-loader!css-loader!less-loader',
                            //sass: 'vue-style-loader!css-loader!sass-loader'
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
            test: /\.styl(us)?$/,
            use: [ 'vue-style-loader',
                'css-loader',
                'stylus-loader'
            ]
        },
         {
            test: /\.css$/,
            use: [
                "vue-style-loader",
                "style-loader",
        　　 　　"css-loader"
       　　 ]
        }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }, 
        {
            oneOf: [{
                    test: /\.(png|jpg|gif|woff|svg|eot|ttf)$/,
                    use: [{
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    }],
                },
                {
                    test: /\.(png|jpg|gif|woff|svg|eot|ttf)$/,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    }],
                },
            ],
        },
        // {
        //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        //     loader: "url-loader",
        //     options: {
        //         limit: 1024,
        //         name: "images/[name].[ext]"
        //     }
        // }, {
        //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        //     loader: 'file-loader',
        //     options: {
        //         limit: 10000,
        //         name: "fonts/[name].[ext]"
        //     }
        // },
         {
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
    ],
    resolve: {
        extensions: [".js", ".vue", ".css", ".less"],
        alias: {
            "vue": "vue/dist/vue.esm.js",
            "@": resolve("../src")
        }
    }
};