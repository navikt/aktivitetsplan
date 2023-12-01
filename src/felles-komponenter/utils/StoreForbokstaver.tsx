import React from 'react';

import { storeForbokstaver } from '../../utils/utils';

function StoreForbokstaver(props: Props) {
    const { tag, children } = props;
    const arg = Array.isArray(children) ? children : [children];
    return React.createElement(tag ? tag : 'span', null, storeForbokstaver(...arg));
}

interface Props {
    tag?: string;
    children: string | Array<string>;
}

export default StoreForbokstaver;
