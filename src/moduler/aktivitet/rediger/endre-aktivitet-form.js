import React from 'react';
import PT from 'prop-types';
import * as AppPT from '../../../proptypes';
import StillingAktivitetForm from '../aktivitet-forms/stilling/aktivitet-stilling-form';
import EgenAktivitetForm from '../aktivitet-forms/egen/aktivitet-egen-form';
import SokeavtaleAktivitetForm from '../aktivitet-forms/sokeavtale/aktivitet-sokeavtale-form';
import BehandlingAktivitetForm from '../aktivitet-forms/behandling/aktivitet-behandling-form';
import MoteAktivitetForm from '../aktivitet-forms/mote/mote-aktivitet-form';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/samtalereferat-form';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/aktivitet-ijobb-form';

import {
    EGEN_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    BEHANDLING_AKTIVITET_TYPE,
    SAMTALEREFERAT_TYPE,
    MOTE_TYPE,
    IJOBB_AKTIVITET_TYPE,
} from '../../../constant';

function EndreAktivitetForm({
    valgtAktivitet,
    lagrer,
    doOppdaterAktivitet,
    visAktivitet,
}) {
    function oppdater(aktivitetData) {
        const oppdatertAktivitet = { ...valgtAktivitet, ...aktivitetData };
        doOppdaterAktivitet(oppdatertAktivitet).then(visAktivitet);
    }

    switch (valgtAktivitet.type) {
        case STILLING_AKTIVITET_TYPE:
            return (
                <StillingAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        case EGEN_AKTIVITET_TYPE:
            return (
                <EgenAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                    endre
                />
            );
        case SOKEAVTALE_AKTIVITET_TYPE:
            return (
                <SokeavtaleAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                    endre
                />
            );
        case BEHANDLING_AKTIVITET_TYPE:
            return (
                <BehandlingAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        case MOTE_TYPE:
            return (
                <MoteAktivitetForm
                    aktivitet={valgtAktivitet}
                    lagrer={lagrer}
                    onSubmit={oppdater}
                />
            );
        case SAMTALEREFERAT_TYPE:
            return (
                <SamtalereferatForm
                    aktivitet={valgtAktivitet}
                    lagrer={lagrer}
                    onSubmit={oppdater}
                />
            );
        case IJOBB_AKTIVITET_TYPE:
            return (
                <IJobbAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        default:
            return null;
    }
}

EndreAktivitetForm.propTypes = {
    valgtAktivitet: AppPT.aktivitet,
    doOppdaterAktivitet: PT.func.isRequired,
    visAktivitet: PT.func.isRequired,
    lagrer: PT.bool.isRequired,
};

EndreAktivitetForm.defaultProps = {
    valgtAktivitet: undefined,
};

export default EndreAktivitetForm;
