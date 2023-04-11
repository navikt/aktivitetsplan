import React from 'react';

import { GRUPPE_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Moteplan } from '../../../../datatypes/arenaAktivitetTypes';
import { formaterDatoKortManed, formaterDatoKortManedTid, formaterTid } from '../../../../utils/dateUtils';
import Informasjonsfelt, { HiddenIfInformasjonsfelt } from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const MoteplanInnhold = (planListe: Moteplan[]) => (
    <span>
        {planListe.map((mote: Moteplan, index) => (
            <span key={index}>
                {formaterDatoKortManedTid(mote.startDato)}
                {formaterTid(mote.sluttDato) === '00:00' ? '' : ` - ${formaterTid(mote.sluttDato)}`},{` ${mote.sted}`}
            </span>
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
            {!erGruppeDatoLike ? (
                <>
                    <FraDato aktivitet={aktivitet} visIkkeSatt />
                    <TilDato aktivitet={aktivitet} visIkkeSatt />
                </>
            ) : null}
            <HiddenIfInformasjonsfelt
                hidden={!erGruppeDatoLike}
                key="likeGruppeDato"
                tittel="Dato"
                innhold={formaterDatoKortManed(fraDato) || 'Dato ikke satt'}
            />
            <Informasjonsfelt
                key="moteplanutenslutteklokke"
                tittel="Tidspunkt og sted"
                beskrivelse
                innhold={MoteplanInnhold(moeteplanListe)}
            />
            <Beskrivelse aktivitet={aktivitet} />
        </>
    );
};

export default GruppeDetaljer;
