import { execSync } from 'child_process';
import { createRequire } from 'node:module';

/// <reference types="vitest" />
import react from '@vitejs/plugin-react';

import { defineConfig, loadEnv, normalizePath, UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import * as path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import tailwindShadowDOM from 'vite-plugin-tailwind-shadowdom';

const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps'));
const standardFontsDir = normalizePath(
    path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts'),
);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    // Make sure release is set client-side, automatic release tagging did not work
    process.env.VITE_RELEASE = execSync('git rev-parse HEAD').toString().trim();

    return {
        worker: {
            format: 'es',
        },
        build: {
            manifest: 'asset-manifest.json',
            outDir: 'build',
            sourcemap: true,
        },
        plugins: [
            react(),
            svgr(),
            tailwindcss(),
            tailwindShadowDOM(),
            viteStaticCopy({
                targets: [
                    { src: cMapsDir, dest: '' },
                    { src: standardFontsDir, dest: '' },
                ],
            }),
        ],
        server: {
            port: 3000,
        },
        test: {
            testTimeout: 3000,
            coverage: {
                reporter: 'lcov',
            },
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/setupTests.jsx'],
        },
    } as UserConfig;
});
