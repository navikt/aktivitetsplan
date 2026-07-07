/// <reference types="vite-plugin-svgr/client" />

import { Entries } from './types/entries';

declare module '*.module.less';

declare module '*.png';

declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

// https://vitejs.dev/guide/features.html#css
declare module '*.less?inline';
declare module '*.css?inline';

declare global {
    interface ObjectConstructor {
        entries<T extends object>(o: T): Entries<T>;
    }
}
