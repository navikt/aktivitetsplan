import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import BehandlingsDetaljer from './BehandlingsDetaljer';
import EgenAktivitetDetaljer from './EgenAktivitetDetaljer';
import EksternAktivitetDetaljer from './EksternAktivitetDetaljer';
import GruppeDetaljer from './GruppeDetaljer';
import IJobbDetaljer from './IjobbDetaljer';
import MoteDetaljer from './MoteDetaljer';
import SamtalereferatDetaljer from './SamtalereferatDetaljer';
import SokeDetaljer from './SokeDetaljer';
import StillingDetaljer from './StillingDetaljer';
import { StillingFraNavDetaljer } from './StillingFraNavDetaljer';
import TiltakDetaljer from './TiltakDetaljer';
import UtdanningDetaljer from './UtdanningDetaljer';

interface Props {
    valgtAktivitet: AlleAktiviteter;
}

const Aktivitetsdetaljer = ({ valgtAktivitet }: Props) => {
    return (
        <section>
            <div className="flex flex-row flex-wrap w-full gap-y-3">
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
                <StillingFraNavDetaljer aktivitet={valgtAktivitet} />
                <EksternAktivitetDetaljer aktivitet={valgtAktivitet} />
            </div>
        </section>
    );
};

export default Aktivitetsdetaljer;
