import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { GRUPPE_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Moteplan } from '../../../../datatypes/arenaAktivitetTypes';
import { formaterDatoKortManed, formaterDatoKortManedTid, formaterTid } from '../../../../utils';
import Informasjonsfelt, { HiddenIfInformasjonsfelt } from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const MoteplanInnhold = (planListe: Moteplan[]) => (
    <span>
        {planListe.map((mote: Moteplan) => (
            <BodyShort key={mote.startDato}>
                {formaterDatoKortManedTid(mote.startDato)}
                {formaterTid(mote.sluttDato) === '00:00' ? '' : ` - ${formaterTid(mote.sluttDato)}`},{` ${mote.sted}`}
            </BodyShort>
        ))}
    </span>
);

interface Props {
    aktivitet: AlleAktiviteter;
}

const GruppeDetaljer = ({ aktivitet }: Props) => {
    if (aktivitet.type !== GRUPPE_AKTIVITET_TYPE) {
        return null;
    }

    const { fraDato, tilDato, moeteplanListe } = aktivitet;
    const erGruppeDatoLike = formaterDatoKortManed(fraDato) === formaterDatoKortManed(tilDato);

    return (
        <>
            <FraDato aktivitet={aktivitet} visIkkeSatt hidden={erGruppeDatoLike} />
            <TilDato aktivitet={aktivitet} visIkkeSatt hidden={erGruppeDatoLike} />
            <HiddenIfInformasjonsfelt
                hidden={!erGruppeDatoLike}
                key="likeGruppeDato"
                tittel={<FormattedMessage id="aktivitetdetaljer.dato-tekst.gruppeaktivitet" />}
                innhold={formaterDatoKortManed(fraDato) || 'Dato ikke satt'}
            />
            <Informasjonsfelt
                key="moteplanutenslutteklokke"
                tittel={<FormattedMessage id="aktivitetdetaljer.moteplan-label" />}
                beskrivelse
                innhold={MoteplanInnhold(moeteplanListe)}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default GruppeDetaljer;
