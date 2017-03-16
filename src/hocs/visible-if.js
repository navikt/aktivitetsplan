import React, { Component, PropTypes as PT } from 'react';
import { fn } from './../utils';

export function visibleIfHOC(WrappingComponent) { // eslint-disable-line import/prefer-default-export
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
