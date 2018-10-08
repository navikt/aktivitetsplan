const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const plugins = (isMock, innside) => [
    new webpack.DefinePlugin({
        MOCK: JSON.stringify(isMock),
        INTERNFLATE: JSON.stringify(innside),
    }),
    new HtmlWebpackPlugin({
        hash: true,
        template: innside
            ? 'example/index-innside.html'
            : 'example/index-utside.html',
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
        test: /\.(svg|png)$/,
        use: {
            loader: 'url-loader',
            options: { noquotes: true },
        },
    },
    { test: /\.less$/, loader: 'ignore-loader' },
];

module.exports = function(env) {
    const isDev = env && env.dev;
    const isMock = env && env.mock;
    const innside = !(env && env.utside);

    return {
        mode: 'development',
        entry: ['whatwg-fetch', './example/example.js'],
        devtool: isDev ? 'source-map' : false,
        output: {
            path: path.resolve(__dirname, 'example/aktivitetsplanfelles'),
            filename: 'bundle.js',
            publicPath: '/aktivitetsplanfelles/',
        },
        stats: {
            children: false,
        },
        plugins: plugins(isMock, innside),
        module: {
            rules: RULES,
        },
        resolve: {
            alias: {
                '~config': path.resolve(__dirname, './example/config'),
            },
            extensions: ['.js', '.jsx', '.json'],
        },
        devServer: {
            port: 3000,
            open: true,
            contentBase: path.resolve(__dirname, 'example'),
            historyApiFallback: {
                index: '/aktivitetsplanfelles/',
            },
            before: app => {
                app.get('/', (req, res) =>
                    res.redirect('/aktivitetsplanfelles/')
                );
            },
        },
    };
};
