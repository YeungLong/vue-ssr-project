const webpack = require("webpack");

module.exports = {
    entry: './src/index.js',
    module: {
        rules: []
    },
    plugins: [
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
    ],
};