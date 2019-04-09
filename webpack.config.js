var path = require('path');
var glob = require("glob");
var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
var copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        dependencies: './js/dependencies.js',
        app: './js/app/app.js',
        components: glob.sync("./js/app/*/*.js")
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: 'dist'
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [{
            test: /\.(sass|scss)$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        url: false
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            autoprefixer({
                                browsers: ['ie >= 8', 'last 4 version']
                            })
                        ],
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader"
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('./style.css'),
        new OptimizeCssnanoPlugin({
            cssnanoOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true
                    }
                }]
            }
        }),
        new copyWebpackPlugin([{
            from: './js/app/*/*.html',
            to: './views/[name].html'
        }])
    ],
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        open: true
    }
}