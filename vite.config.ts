/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// vite.config.js
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        port: 3000,
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./src/setupTests.jsx'],
    },
});
