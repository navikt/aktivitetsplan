var webpack = require('webpack');
var path = require('path');

const DEBUG = process.env.NODE_ENV !== "production";

const PRODUCTION_PLUGINS = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
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
]

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
    devtool: DEBUG ? "inline-sourcemap" : false,
    entry: ['whatwg-fetch', './src/app.js'],
    module: {
        rules: RULES,
        loaders: LOADERS
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    output: {
        path: "./dist",
        filename: "aktivitetsplan.min.js",
        library: "Aktivitetsplan",
    },
    externals: {
        '~config': '~config'
    },
    plugins: DEBUG ? [] : PRODUCTION_PLUGINS,
};
