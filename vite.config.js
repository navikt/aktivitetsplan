import react from '@vitejs/plugin-react-swc';
// vite.config.js
import svgr from 'vite-plugin-svgr';

export default {
    plugins: [react(), svgr()],
    server: {
        port: 3000,
    },
};
