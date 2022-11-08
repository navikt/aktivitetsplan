import React, { ComponentClass, FunctionComponent } from 'react';

import { fn } from '../utils';

type func = () => void;

interface Props {
    visible?: boolean | func;
}

// Todo deprecate it
export default function visibleIfHOC<PropsType extends {}>(
    Component: FunctionComponent<PropsType> | ComponentClass<PropsType, any>
) {
    return class WithVisibleIf extends React.Component<PropsType & Props> {
        render() {
            const { visible, ...props } = this.props;

            // This fn is a bad idea. Never do this
            const isVisible = fn(visible)(props);
            if (isVisible || isVisible === undefined) {
                return React.createElement<PropsType>(Component, props as PropsType);
            }
            return null;
        }
    };
}
