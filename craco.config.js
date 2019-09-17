/* eslint-disable */

const path = require('path');
const CracoLessPlugin = require('craco-less');

const BUILD_PATH = path.resolve(__dirname, './build');

const removeCssHashPlugin = {
    overrideWebpackConfig: ({
        webpackConfig,
        cracoConfig,
        pluginOptions,
        context: { env, paths },
    }) => {
        const { plugins } = webpackConfig;
        plugins.forEach(plugin => {
            const { options } = plugin;

            if (!options) {
                return;
            }

            if (options.filename && options.filename.endsWith('.css')) {
                options.filename = 'static/css/[name].css';
                options.chunkFilename = 'static/css/[name].chunk.css';
            }
        });
        return webpackConfig;
    },
};

module.exports = {
    plugins: [
        { plugin: CracoLessPlugin },
        {
            plugin: CracoLessPlugin,
            options: {
                modifyLessRule: function(lessRule, _context) {
                    lessRule.test = /\.(module)\.(less)$/;
                    lessRule.exclude = /node_modules/;

                    return lessRule;
                },
                cssLoaderOptions: {
                    modules: true,
                    localIdentName: '[local]_[hash:base64:5]',
                },
            },
        },
        { plugin: removeCssHashPlugin },
    ],
    webpack: {
        configure: {
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        default: false,
                        vendors: false,
                    },
                },
                runtimeChunk: false,
            },
            output: {
                path: BUILD_PATH,
                filename: 'static/js/[name].js',
            },
        },
    },
};
