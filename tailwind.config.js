module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                104: '26rem',
                120: '40rem',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
