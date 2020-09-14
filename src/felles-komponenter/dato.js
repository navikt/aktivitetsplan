import React from 'react';
import PT from 'prop-types';
import { formaterDatoTid, formaterDatoKortManed, formaterDatoEllerTidSidenUtenKlokkeslett } from '../utils';

export default function Dato({ visTidspunkt, children, ...resten }) {
    return <span {...resten}>{visTidspunkt ? formaterDatoTid(children) : formaterDatoKortManed(children)}</span>;
}

Dato.propTypes = {
    children: PT.string,
    visTidspunkt: PT.bool,
};

Dato.defaultProps = {
    children: undefined,
    visTidspunkt: false,
};

export function DatoEllerTidSiden({ children, ...rest }) {
    return <span {...rest}>{formaterDatoEllerTidSidenUtenKlokkeslett(children)}</span>;
}

DatoEllerTidSiden.propTypes = {
    children: PT.string,
};

DatoEllerTidSiden.defaultProps = {
    children: undefined,
};
