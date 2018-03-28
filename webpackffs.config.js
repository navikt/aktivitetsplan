/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== "production";

const PLUGINS = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({sourceMap: true}),
];

const BABEL_INCLUDE = [
    /src/,
    /node_modules.*src/
];

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
            options: {'noquotes': true}
        }
    },
    { test: /\.less$/, loader: 'ignore-loader' }
];

const LOADERS = [
    {
        test: /\.jsx?$/,
        include: BABEL_INCLUDE,
        loader: 'babel-loader',
        query: {
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
    }
];

module.exports = {
    context: __dirname,
    devtool: DEBUG ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    entry: ['whatwg-fetch', './src/fss/aktivitetsplan-root.js'],
    module: {
        rules: RULES,
        loaders: LOADERS
    },
    resolve: {
        alias: {
            "~config": path.resolve(__dirname, "./src/fss/config")
        },
        extensions: ['.js', '.jsx', '.json']
    },
    output: {
        path: path.resolve(__dirname,'./build/'),
        filename: "aktivitetsplan.ffs.min.js",
        library: "AktivitetsplanRoot",
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM', // NB! vi er transitivt avhengig av denne gjennom nav-react-*.
        'redux': 'Redux',
        'redux-thunk': 'ReduxThunk',
        'react-redux': 'ReactRedux',
    },
    plugins: DEBUG ? [] : PLUGINS
};
