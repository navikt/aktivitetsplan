/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const LIBRARIES = [
    'react',
    'react-dom',
    'redux',
    'redux-form',
    'react-router',
    'react-redux-form-validation',
    'react-day-picker',
    'react-intl',
];

const DEBUG = process.env.NODE_ENV !== 'production';

const PRODUCTION_PLUGINS = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js',
    }),
    new UglifyJSPlugin({ sourcemap: true }),
    new HtmlWebpackPlugin({
        hash: true,
        template: './src/ssb/index.html',
        js: ['vendor.bundle.js', 'bundle.js'],
    }),
];

const PLUGINS = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js',
    }),
    new HtmlWebpackPlugin({
        hash: true,
        template: './src/ssb/index.html',
        js: ['vendor.bundle.js', 'bundle.js'],
    }),
];

const BABEL_INCLUDE = [/src/, /node_modules.*src/];

const RULES = [
    {
        test: /\.jsx?/,
        include: BABEL_INCLUDE,
        enforce: 'pre',
        loader: 'babel-loader',
    },
    {
        test: /\.(svg|png)$/,
        use: {
            loader: 'url-loader',
            options: { noquotes: true },
        },
    },
    { test: /\.less$/, loader: 'ignore-loader' },
];

const LOADERS = [
    {
        test: /\.jsx?$/,
        include: BABEL_INCLUDE,
        loader: 'babel-loader',
        query: {
            plugins: [
                'react-html-attrs',
                'transform-decorators-legacy',
                'transform-class-properties',
            ],
        },
    },
];

module.exports = {
    context: __dirname,
    devtool: DEBUG ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    entry: {
        app: './src/ssb/index.js',
        vendor: LIBRARIES,
    },
    module: {
        rules: RULES,
        loaders: LOADERS,
    },
    resolve: {
        alias: {
            '~config': path.resolve(__dirname, './src/ssb/config'),
        },
        extensions: ['.js', '.jsx', '.json'],
    },
    output: {
        path: path.resolve(__dirname, './build/'),
        filename: 'bundle.js',
        publicPath: '/aktivitetsplan/',
    },
    plugins: DEBUG ? PLUGINS : PRODUCTION_PLUGINS,
};
