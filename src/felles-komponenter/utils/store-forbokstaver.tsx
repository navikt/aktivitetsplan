import React from 'react';
import { storeForbokstaver } from '../../utils';

function StoreForbokstaver(props: Props) {
    const { tag, children } = props;

    return React.createElement(tag ? tag : 'span', null, storeForbokstaver(children));
}

interface Props {
    tag?: string;
    children: string | Array<string>;
}

export default StoreForbokstaver;
