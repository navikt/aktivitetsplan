import PT from 'prop-types';
import React from 'react';

import { fn } from '../../utils/utils';

export default function hiddenIfHOC(WrappingComponent) {
    function hiddenIf({ hidden, ...props }) {
        if (!fn(hidden)(props)) {
            return React.createElement(WrappingComponent, props);
        }
        return null;
    }

    hiddenIf.defaultProps = {
        hidden: false,
    };
    hiddenIf.propTypes = {
        hidden: PT.oneOfType([PT.bool, PT.func]),
    };

    return hiddenIf;
}

function hoc(type) {
    return hiddenIfHOC((props) => React.createElement(type, props, props.children));
}

export const div = hoc('div');
export const span = hoc('span');
export const hr = hoc('hr');
export const section = hoc('section');
export const button = hoc('button');
