module.exports = {
    plugins: [{ plugin: require('craco-less') }],
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
};
