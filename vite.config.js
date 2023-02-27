// vite.config.js
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default {
    plugins: [react(), svgr()],
    server: {
        port: 3000,
    },
};
