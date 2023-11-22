/// <reference types="vite-plugin-svgr/client" />

declare module '*.module.less';

declare module '*.png';

declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

// https://vitejs.dev/guide/features.html#css
declare module '*.less?inline';
declare module '*.css?inline';
