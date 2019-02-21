const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isProd = !!(process.env.NODE_ENV == "prod");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = { 
    devtool: isProd ? undefined : 'cheap-module-eval-source-map',
    entry: {
        login: './src/js/login.js'
    },
    output: {
        path: __dirname + '/build',
        filename: 'js/bundle.[name].js'
    },
    module: {   
        rules: [{
            test: /\.js$/, 
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                }
            }]
        },{
            test: /\.less$/, 
            use: ['style-loader', 'css-loader', 'less-loader']
        },{
           test: /\.less$/,
           use: [
               MiniCssExtractPlugin.loader,
               "css-loader", 
               {loader: "less-loader"}
           ]
       }]
    },
    mode: 'production',
    node: {
        dns: 'mock',
        net: 'mock'
    },
    watchOptions: {
        ignored: ['build', 'node_modules']
    },
    optimization: isProd ? undefined : {
        minimizer: [new UglifyJsPlugin({
            test: /\.js(\?.*)?$/i
        })]
    },
    plugins: [
       new MiniCssExtractPlugin({
           // Options similar to the same options in webpackOptions.output
           // both options are optional
           filename: "./css/bundle.[name].css"
       })
    ]
};