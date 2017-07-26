import React from 'react';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import BehandlingAktivitetForm from './aktivitet-behandling-form';
import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';

function BehandlingAktivitet({ onLagreNyAktivitet, intl }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = {
            ...aktivitet,
            type: BEHANDLING_AKTIVITET_TYPE,
        };
        onLagreNyAktivitet(nyAktivitet);
    };

    return (
        <BehandlingAktivitetForm
            onSubmit={onLagNyAktivitetSubmit}
            defaultTittel={intl.formatMessage({
                id: 'behandling-aktivitet-form.default-tittel',
            })}
        />
    );
}

BehandlingAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(BehandlingAktivitet);
