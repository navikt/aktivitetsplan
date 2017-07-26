import React from 'react';
import PT from 'prop-types';
import EgenAktivitetForm from './aktivitet-egen-form';
import { EGEN_AKTIVITET_TYPE } from '../../../../constant';

function EgenAktivitet({ lagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = {
            ...aktivitet,
            type: EGEN_AKTIVITET_TYPE,
        };

        lagreNyAktivitet(nyAktivitet);
    };

    return <EgenAktivitetForm onSubmit={onLagNyAktivitetSubmit} />;
}

EgenAktivitet.propTypes = {
    lagreNyAktivitet: PT.func.isRequired,
};

export default EgenAktivitet;
