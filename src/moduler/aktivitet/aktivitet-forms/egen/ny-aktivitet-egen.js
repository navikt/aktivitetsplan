import React from 'react';
import PT from 'prop-types';
import EgenAktivitetForm from './aktivitet-egen-form';
import { EGEN_AKTIVITET_TYPE } from '../../../../constant';

function EgenAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = {
            ...aktivitet,
            type: EGEN_AKTIVITET_TYPE,
        };

        onLagreNyAktivitet(nyAktivitet);
    };

    return <EgenAktivitetForm onSubmit={onLagNyAktivitetSubmit} />;
}

EgenAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
};

export default EgenAktivitet;
