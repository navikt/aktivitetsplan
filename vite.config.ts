import { execSync } from 'child_process';
import { createRequire } from 'node:module';

/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, normalizePath } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import * as path from 'node:path';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps'));
const standardFontsDir = normalizePath(
    path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts'),
);

type BuildMode = 'prod-intern' | 'dev-intern' | 'prod-ekstern' | 'dev-ekstern' | undefined;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    // Make sure release is set client-side, automatic release tagging did not work
    process.env.VITE_SENTRY_RELEASE = execSync('git rev-parse HEAD').toString().trim();
    const buildMode = process.env.MODE as BuildMode;
    const sentryProject =
        buildMode === 'prod-ekstern' || buildMode === 'dev-ekstern'
            ? 'aktivitetsplan-ekstern'
            : 'aktivitetsplan-intern';

    return {
        build: {
            manifest: 'asset-manifest.json',
            outDir: 'build',
            sourcemap: true,
        },
        plugins: [
            react(),
            svgr(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        VITE_DEKORATOREN_URL: env.VITE_DEKORATOREN_URL,
                    },
                },
            }),
            visualizer({
                filename: 'bundle-stats.html',
            }),
            viteStaticCopy({
                targets: [
                    { src: cMapsDir, dest: '' },
                    { src: standardFontsDir, dest: '' },
                ],
            }),
            sentryVitePlugin({
                org: 'nav',
                project: sentryProject,
                url: 'https://sentry.gc.nav.no',
                applicationKey: sentryProject,
                release: {
                    deploy: {
                        env: buildMode === 'prod-intern' || buildMode === 'prod-ekstern' ? 'prod' : 'dev',
                    },
                },
                // Auth tokens can be obtained from https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/
                authToken: process.env.SENTRY_AUTH_TOKEN,
                moduleMetadata: {
                    org: 'nav',
                    project: sentryProject,
                },
            }),
        ],
        server: {
            port: 3000,
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/setupTests.jsx'],
        },
    };
});
