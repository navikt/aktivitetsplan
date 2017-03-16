import React, { Component, PropTypes as PT } from 'react';

class ParamsContext extends Component {
    getChildContext() {
        return {
            sprak: this.props.params.sprak,
            params: this.props.params
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

ParamsContext.childContextTypes = {
    sprak: PT.string.isRequired,
    params: PT.object.isRequired
};
ParamsContext.propTypes = {
    params: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    children: PT.node.isRequired
};

const withContext = (component, name, type) => {
    const contextTypes = component.contextTypes || {};
    contextTypes[name] = type;

    // eslint-disable-next-line no-param-reassign
    component.contextTypes = contextTypes;

    return component;
};

export const settSprakContext = (component) => withContext(component, 'sprak', PT.string.isRequired);
export const settParamsContext = (component) => withContext(component, 'params', PT.object.isRequired);

export default ParamsContext;
