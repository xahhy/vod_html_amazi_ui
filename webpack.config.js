/**
 * Created by hhy on 2017/11/10.
 */
var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: {
        "bundle": "./src/app/app.js",
        "bundle.min": "./src/app/app.js"
    },
    devtool: "eval-source-map",
    output: {
        path: path.join(__dirname,"dist"),
        filename: "[name].js"
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};