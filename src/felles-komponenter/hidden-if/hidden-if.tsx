import React, { ReactNode } from 'react';

import { fn } from '../../utils/utils';

interface Props {
    hidden: boolean | (() => boolean);
    children: ReactNode;
}

export default function HiddenIfHOC({ hidden, children }: Props) {
    if (fn(hidden)) return null;
    return children;
}

export const hiddenIfWithWrapperElement =
    (type: 'span' | 'section' | 'button' | 'div') =>
    ({ hidden, children }: Props) => {
        const element = React.createElement(type, {}, children);
        return <HiddenIfHOC hidden={hidden}>{element}</HiddenIfHOC>;
    };

export const div = hiddenIfWithWrapperElement('div');
export const span = hiddenIfWithWrapperElement('span');
export const section = hiddenIfWithWrapperElement('section');
export const button = hiddenIfWithWrapperElement('button');
