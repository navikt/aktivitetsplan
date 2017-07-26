import React from 'react';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import SokeavtaleAktivitetForm from './aktivitet-sokeavtale-form';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';

function SokeavtaleAktivitet({ onLagreNyAktivitet, intl }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = {
            ...aktivitet,
            type: SOKEAVTALE_AKTIVITET_TYPE,
        };

        onLagreNyAktivitet(nyAktivitet);
    };

    return (
        <SokeavtaleAktivitetForm
            onSubmit={onLagNyAktivitetSubmit}
            defaultTittel={intl.formatMessage({
                id: 'sokeavtale-aktivitet-form.default-tittel',
            })}
        />
    );
}

SokeavtaleAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(SokeavtaleAktivitet);
