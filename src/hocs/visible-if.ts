import React from 'react';
import { fn } from '../utils';

type func = () => void;

interface Props {
    visible?: boolean | func;
}

// Todo deprecate it
export default function visibleIfHOC<P>(Component: React.ComponentType<P>) {
    return class WithVisibleIf extends React.Component<P & Props> {
        render() {
            const { visible, ...props } = this.props;

            // This fn is a bad idea. Never do this
            const isVisible = fn(visible)(props);
            if (isVisible || isVisible === undefined) {
                return React.createElement(Component, props as P);
            }
            return null;
        }
    };
}
