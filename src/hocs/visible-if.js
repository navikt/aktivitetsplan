import React, { Component } from 'react';
import PT from 'prop-types';
import { fn } from './../utils';

export default function visibleIfHOC(WrappingComponent) {
    class visibleIf extends Component {
        render() {
            const { visible, ...props } = this.props;
            if (fn(visible)(props)) {
                return React.createElement(WrappingComponent, props);
            }
            return null;
        }
    }

    visibleIf.defaultProps = {
        visible: true
    };
    visibleIf.propTypes = {
        visible: PT.oneOfType([PT.bool, PT.func])
    };

    return visibleIf;
}
