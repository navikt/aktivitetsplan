import React from 'react';

import { formaterDatoKortManed, formaterDatoTid } from '../utils';

interface DatoProps {
    visTidspunkt?: boolean;
    children?: string;
}

const Dato = (props: DatoProps) => {
    const { visTidspunkt = false, children, ...resten } = props;

    return <span {...resten}>{visTidspunkt ? formaterDatoTid(children) : formaterDatoKortManed(children)}</span>;
};

export default Dato;
