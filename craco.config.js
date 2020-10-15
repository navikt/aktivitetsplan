/* eslint-disable */

const path = require('path');
const CracoLessPlugin = require('craco-less');

const BUILD_PATH = path.resolve(__dirname, './build');

const removeCssHashPlugin = {
    overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
        const { plugins } = webpackConfig;
        plugins.forEach((plugin) => {
            const { options } = plugin;

            if (!options) {
                return;
            }

            if (options.filename && options.filename.endsWith('.css')) {
                /*  Vi overskriver følgende funksjon:
                    options.moduleFilename = () => options.filename || DEFAULT_FILENAME
                    Tidligere overskrev vi options.filname fra
                    options.filename = "static/css/[name].[contenthash8].css" til
                    options.filename = "static/css/[name].css",
                    men ved oppgradering av craco og reactscripts fra hhv. 3.5.0 til 5.5.0 og 2.1.8 til 3.2.0
                    fungerte ikke dette lenger. Breaking changes eller bug i react-scripts eller craco?
                 */
                options.moduleFilename = () => 'static/css/[name].css';
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
                modifyLessRule: function (lessRule, _context) {
                    lessRule.test = /\.(module)\.(less)$/;
                    lessRule.exclude = /node_modules/;

                    return lessRule;
                },
                cssLoaderOptions: {
                    modules: { localIdentName: '[local]_[hash:base64:5]' },
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
