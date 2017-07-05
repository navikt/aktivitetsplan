import React, { Component } from 'react';
import { getDisplayName } from './utils';

export default function componentize(sideEffects) {
    return InnerComponent => {
        class WrappingComponent extends Component {
            componentWillMount() {
                if (sideEffects && sideEffects.componentWillMount) {
                    sideEffects.componentWillMount(this.state, this.props);
                }
            }

            componentDidMount() {
                if (sideEffects && sideEffects.componentDidMount) {
                    sideEffects.componentDidMount(this.state, this.props);
                }
            }

            render() {
                return React.createElement(InnerComponent, this.props);
            }
        }

        WrappingComponent.displayName = `Componentized(${getDisplayName(
            InnerComponent
        )})`;

        return WrappingComponent;
    };
}
