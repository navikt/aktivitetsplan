import svgr from 'vite-plugin-svgr';

export default {
    plugins: [svgr()],
    optimizeDeps: {
        entries: [
            'src/api/**/*.{jsx,tsx,js,ts}',
            'src/datatypes/**/*.{jsx,tsx,js,ts}',
            'src/felles-komponenter/**/*.{jsx,tsx,js,ts}',
            'src/hocs/**/*.{jsx,tsx,js,ts}',
            'src/hovedside/**/*.{jsx,tsx,js,ts}',
            'src/ikoner/**/*.{jsx,tsx,js,ts}',
            'src/mocks/**/*.{jsx,tsx,js,ts}',
            'src/moduler/**/*.{jsx,tsx,js,ts}',
            'src/utils/**/*.{jsx,tsx,js,ts}',
        ],
        include: ['react'],
    },
};
