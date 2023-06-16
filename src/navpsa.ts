import * as React from 'react';
import * as ReactDOM from 'react-dom';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
function getGlobal(): { NAVSPA: {}; 'NAVSPA-V2': {} } {
    if (typeof globalThis !== 'undefined') return globalThis as any;

    // IE11 fallback
    if (typeof self !== 'undefined') return self as any;
    if (typeof window !== 'undefined') return window as any;
    if (typeof global !== 'undefined') return global as any;
    throw new Error('Unable to locate globale object');
}

interface NAVSPAScope {
    [name: string]: NAVSPAApp;
}

type NAVSPAApp = {
    mount(element: HTMLElement, props: any): void;
    unmount(element: HTMLElement): void;
};

const globalScope = getGlobal();
const scopeV2: NAVSPAScope = (globalScope['NAVSPA-V2'] = globalScope['NAVSPA-V2'] || {});

export function eksporterNAVSPA<PROPS>(name: string, component: React.ComponentType<PROPS>) {
    scopeV2[name] = {
        mount(element: HTMLElement, props: PROPS) {
            ReactDOM.render(React.createElement(component, props), element);
        },
        unmount(element: HTMLElement) {
            ReactDOM.unmountComponentAtNode(element);
        },
    };
}
