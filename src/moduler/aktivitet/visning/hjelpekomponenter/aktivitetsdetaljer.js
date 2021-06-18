import PT from 'prop-types';
import React from 'react';

import * as AppPT from '../../../../proptypes';
import BehandlingsDetaljer from '../detaljer/behandlings-detaljer';
import EgenAktivitetDetaljer from '../detaljer/egenAktivitet-detaljer';
import GruppeDetaljer from '../detaljer/gruppe-detaljer';
import IJobbDetaljer from '../detaljer/ijob-detaljer';
import MoteDetaljer from '../detaljer/mote-detaljer';
import { RekrutteringsbistandStillingDetaljer } from '../detaljer/RekrutteringsbistandStillingDetaljer';
import SamtalereferatDetaljer from '../detaljer/samtalereferat-detaljer';
import SokeDetaljer from '../detaljer/soke-detaljer';
import StillingDetaljer from '../detaljer/stilling-detaljer';
import TiltakDetaljer from '../detaljer/tiltak-detaljer';
import UtdanningDetaljer from '../detaljer/utdanning-detaljer';

function Aktivitetsdetaljer({ valgtAktivitet }) {
    return (
        <section className="aktivitetvisning__detaljer aktivitetsdetaljer">
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
            <RekrutteringsbistandStillingDetaljer aktivitet={valgtAktivitet} />
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
