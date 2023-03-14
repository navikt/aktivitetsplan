declare module '*.module.less';

declare module '*.png';

declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
