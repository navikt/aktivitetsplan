import React from 'react';

const HiddenIf =
    (tag: 'div' | 'span' | 'section' | 'button') =>
    ({ hidden, children, ...rest }: { children: React.ReactNode; hidden: boolean | (() => boolean); [key: string]: unknown }) => {
        const isHidden = typeof hidden === 'function' ? hidden() : hidden;
        if (!isHidden) {
            return React.createElement(tag, { ...rest }, children);
        }
        return null;
    };

export default function hiddenIfHOC<P extends object>(WrappingComponent: React.ComponentType<P>) {
    return ({ hidden, children, ...rest }: P & { children?: React.ReactNode; hidden: boolean | (() => boolean) }) => {
        const isHidden = typeof hidden === 'function' ? hidden() : hidden;
        if (!isHidden) {
            return <WrappingComponent {...(rest as unknown as P)}>{children}</WrappingComponent>;
        }
        return null;
    };
}

export const div = HiddenIf('div');
export const span = HiddenIf('span');
export const section = HiddenIf('section');
export const button = HiddenIf('button');
