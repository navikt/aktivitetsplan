import React from 'react';
import PT from 'prop-types';
import StillingAktivitetForm from './aktivitet-stilling-form';
import { STILLING_AKTIVITET_TYPE } from '../../../../constant';

function StillingAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = { ...aktivitet, type: STILLING_AKTIVITET_TYPE };
        onLagreNyAktivitet(nyAktivitet);
    };
    return <StillingAktivitetForm onSubmit={onLagNyAktivitetSubmit} />;
}

StillingAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
};

export default StillingAktivitet;
