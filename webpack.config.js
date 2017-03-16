var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PLUGINS = [
    new HtmlWebpackPlugin({
        template: 'example/index.html'
    }),
];

const RULES = [
    {
        test: /\.jsx?/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'babel-loader',
    },
    {
        test: /\.svg$/,
        use: {
            loader: 'url-loader',
            options: {'noquotes': true}
        }
    },
    {
        test: /\.less$/,
        use: [
            'style-loader',
            {loader: 'css-loader', options: {importLoaders: 1}},
            'less-loader'
        ]
    }
];

const LOADERS = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
    }
];

module.exports = {
    context: __dirname,
    devtool: "inline-sourcemap",
    entry: [
        'whatwg-fetch',
        './example/example.js'
    ],
    module: {
        rules: RULES,
        loaders: LOADERS
    },
    resolve: {
        alias: {
            "~config": path.resolve(__dirname, "./example/config")
        },
        extensions: ['.js', '.jsx', '.json']
    },
    output: {
        path: "./example/build",
        filename: "bundle.js",
    },
    plugins: PLUGINS,
};
