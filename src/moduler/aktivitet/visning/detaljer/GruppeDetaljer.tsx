import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { GRUPPE_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Moteplan } from '../../../../datatypes/arenaAktivitetTypes';
import { formaterDatoKortManed, formaterDatoKortManedTid, formaterTid } from '../../../../utils/dateUtils';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const MoteplanInnhold = (planListe: Moteplan[]) => (
    <ul className="list-disc list-inside">
        {planListe.map((mote: Moteplan, index) => (
            <li className="" key={index}>
                <BodyShort className="inline">
                    {formaterDatoKortManedTid(mote.startDato)}
                    {formaterTid(mote.sluttDato) === '00:00' ? '' : ` - ${formaterTid(mote.sluttDato)}`},
                    {` ${mote.sted}`}
                </BodyShort>
            </li>
        ))}
    </ul>
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
            ) : (
                <Informasjonsfelt tittel="Dato" innhold={formaterDatoKortManed(fraDato) || 'Dato ikke satt'} />
            )}
            <Informasjonsfelt
                fullbredde
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
