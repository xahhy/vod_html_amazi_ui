/**
 * Created by hhy on 2017/11/10.
 */
var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: {
        "bundle": "./src/app/router.js",
        "bundle.min": "./src/app/router.js"
    },
    devtool: "eval-source-map",
    output: {
        path: path.join(__dirname,"dist"),
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};