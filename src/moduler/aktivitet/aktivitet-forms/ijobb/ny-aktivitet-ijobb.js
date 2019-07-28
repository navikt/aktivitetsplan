import React from 'react';
import PT from 'prop-types';
import IJobbAktivitetForm from './aktivitet-ijobb-form';
import { IJOBB_AKTIVITET_TYPE } from '../../../../constant';

function IJobbAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = { ...aktivitet, type: IJOBB_AKTIVITET_TYPE };
        return onLagreNyAktivitet(nyAktivitet);
    };
    return <IJobbAktivitetForm onSubmit={onLagNyAktivitetSubmit} />;
}

IJobbAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
};

export default IJobbAktivitet;
