const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const plugins = isMock => [
    new OptimizeCssAssetsPlugin(),
    new ExtractTextPlugin('index.css'),
    new webpack.DefinePlugin({
        MOCK: JSON.stringify(isMock),
    }),
    new HtmlWebpackPlugin({
        template: 'example/index.html',
    }),
];

const BABEL_INCLUDE = [/src/, /example/];

const RULES = [
    {
        test: /\.jsx?/,
        include: BABEL_INCLUDE,
        enforce: 'pre',
        loader: 'babel-loader',
    },
    {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
            use: [
                {
                    loader: 'css-loader',
                },
                {
                    loader: 'less-loader',
                    options: {
                        globalVars: {
                            coreModulePath: "'./../../../node_modules/'",
                            nodeModulesPath: "'./../../../node_modules/'",
                            aktivitetsplanNodeModulesPath: "'./../node_modules/'",
                        },
                    },
                },
            ],
        }),
    },
    {
        test: /\.(svg|png)$/,
        use: {
            loader: 'url-loader',
            options: { noquotes: true },
        },
    },
];

module.exports = function(env) {
    const isDev = env && env.dev;
    const isMock = env && env.mock;

    return {
        entry: ['whatwg-fetch', './example/example.js'],
        devtool: isDev ? 'source-map' : false,
        output: {
            path: path.resolve(__dirname, 'example/build'),
            filename: 'bundle.js',
            publicPath: '/aktivitetsplanfelles/',
        },
        stats: {
            children: false,
        },
        plugins: plugins(isMock),
        module: {
            rules: RULES,
        },
        resolve: {
            alias: {
                '~config': path.resolve(__dirname, './example/config'),
            },
            extensions: ['.js', '.jsx', '.json', '.less'],
        },
        devServer: {
            port: 3000,
            open: true,
            historyApiFallback: {
                index: '/aktivitetsplanfelles/',
            },
        },
    };
};
