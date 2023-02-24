import PT from 'prop-types';
import React from 'react';

import * as AppPT from '../../../../proptypes';
import BehandlingsDetaljer from './behandlings-detaljer';
import EgenAktivitetDetaljer from './egenAktivitet-detaljer';
import EksternAktivitetDetaljer from './EksternAktivitetDetaljer';
import GruppeDetaljer from './gruppe-detaljer';
import IJobbDetaljer from './ijob-detaljer';
import MoteDetaljer from './mote-detaljer';
import SamtalereferatDetaljer from './samtalereferat-detaljer';
import SokeDetaljer from './soke-detaljer';
import StillingDetaljer from './stilling-detaljer';
import { StillingFraNavDetaljer } from './StillingFraNavDetaljer';
import TiltakDetaljer from './tiltak-detaljer';
import UtdanningDetaljer from './utdanning-detaljer';

function Aktivitetsdetaljer({ valgtAktivitet }) {
    return (
        <section>
            <BehandlingsDetaljer aktivitet={valgtAktivitet} />
            <EgenAktivitetDetaljer aktivitet={valgtAktivitet} />
            <GruppeDetaljer aktivitet={valgtAktivitet} />
            <IJobbDetaljer aktivitet={valgtAktivitet} />
            <MoteDetaljer aktivitet={valgtAktivitet} />
            <SamtalereferatDetaljer aktivitet={valgtAktivitet} />
            <SokeDetaljer aktivitet={valgtAktivitet} />
            <StillingDetaljer aktivitet={valgtAktivitet} />
            <TiltakDetaljer aktivitet={valgtAktivitet} />
            <UtdanningDetaljer aktivitet={valgtAktivitet} />
            <StillingFraNavDetaljer stillingFraNavData={valgtAktivitet.stillingFraNavData} />
            <EksternAktivitetDetaljer aktivitet={valgtAktivitet} />
        </section>
    );
}

Aktivitetsdetaljer.propTypes = {
    className: PT.string,
    valgtAktivitet: AppPT.aktivitet.isRequired,
};

Aktivitetsdetaljer.defaultProps = {
    className: undefined,
};

export default Aktivitetsdetaljer;
