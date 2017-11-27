declare module "nav-frontend-ikoner-assets" {
    import * as React from "react";

    export interface ElementProps {
        height?: string | number,
        width?: string | number,
        kind?: string,
        onClick?: () => any,
        preview?: boolean,
        size?: string | number,
        style?: any,
        wrapperStyle?: any,
        title?: string,
        ariaLabel?: string
        className?: string
    }

    export class NavFrontendIkonerAssets extends React.Component<ElementProps, {}> {
         renderPreview(): any;
         renderIcon(kind: string): any;
         renderPreviewKind(kind: string): any;
         getIcon(kind: string): any;
    }

    export default NavFrontendIkonerAssets;
}
