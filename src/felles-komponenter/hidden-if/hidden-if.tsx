import PT, { ReactComponentLike } from 'prop-types';
import React, { ReactElement } from 'react';

import { fn } from '../../utils/utils';

const HiddenIf =
    (tag: 'div' | 'span' | 'section' | 'button') =>
    ({ hidden, children, ...rest }: { children: ReactElement; hidden: boolean | (() => boolean) }) => {
        const isHidden = typeof hidden === 'function' ? hidden() : hidden;
        if (!isHidden) {
            return React.createElement(tag, { ...rest }, children);
        }
        return null;
    };

export default function hiddenIfHOC(WrappingComponent: ReactComponentLike) {
    return ({ hidden, children, ...rest }: { children: ReactElement; hidden: boolean | (() => boolean) }) => {
        const isHidden = typeof hidden === 'function' ? hidden() : hidden;
        if (!isHidden) {
            return <WrappingComponent {...rest}>{children}</WrappingComponent>;
        }
        return null;
    };
}

export const div = HiddenIf('div');
export const span = HiddenIf('span');
export const section = HiddenIf('section');
export const button = HiddenIf('button');
