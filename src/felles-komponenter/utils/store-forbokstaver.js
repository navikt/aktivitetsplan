import React from 'react';
import PT from 'prop-types';
import { storeForbokstaver } from '../../utils';

function StoreForbokstaver({ tag, children, ...props }) {
    return React.createElement(tag, props, storeForbokstaver(children));
}

StoreForbokstaver.propTypes = {
    tag: PT.string,
    children: PT.string.isRequired,
};

StoreForbokstaver.defaultProps = {
    tag: 'span',
};

export default StoreForbokstaver;
