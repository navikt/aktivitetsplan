import { BodyShort, Loader } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { MotedeltakerRolle, motedeltakerRolleTekst } from '../../../../datatypes/internAktivitetTypes';
import { formaterDatoManed, norskTidSuffix } from '../../../../utils/dateUtils';
import { kanalMap } from '../../../../utils/textMappers';
import { beregnKlokkeslettVarighet, formatterKlokkeslett, formatterVarighet } from '../../aktivitet-util';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { selectPersonNavn, selectPersonStatus } from '../../../person/person-selector';
import { Status } from '../../../../store/createGenericSlice';
import { useErVeileder } from '../../../../Provider';

interface Props {
    aktivitet: AlleAktiviteter;
}

const MoteDetaljer = ({ aktivitet }: Props) => {
    const brukerNavn = useSelector(selectPersonNavn);
    const personStatus = useSelector(selectPersonStatus);
    const erVeileder = useErVeileder();
    if (aktivitet.type !== MOTE_TYPE) {
        return null;
    }

    const moteTid = beregnKlokkeslettVarighet(aktivitet);

    return (
        <>
            <Informasjonsfelt key="dato" tittel="Dato" innhold={formaterDatoManed(aktivitet.fraDato)} />
            <Informasjonsfelt
                key="klokkeslett"
                tittel={`Klokkeslett${norskTidSuffix(aktivitet.fraDato)}`}
                innhold={formatterKlokkeslett(moteTid?.klokkeslett)}
            />
            <Informasjonsfelt key="kanal" tittel="Møteform" innhold={aktivitet.kanal && kanalMap[aktivitet.kanal]} />
            <Informasjonsfelt key="varighet" tittel="Varighet" innhold={formatterVarighet(moteTid?.varighet)} />
            <Informasjonsfelt
                tittel="Deltakere"
                fullbredde
                innhold={
                    <ul role="list" className="list-none p-0 m-0">
                        <BodyShort as="li">
                            {!erVeileder
                                ? 'Du'
                                : (brukerNavn ??
                                  (personStatus === Status.ERROR ? (
                                      'Kunne ikke hente brukerens navn'
                                  ) : (
                                      <Loader size="small" title="Henter brukerens navn" />
                                  )))}
                        </BodyShort>
                        {(aktivitet.motedeltakere ?? [])
                            .filter((deltaker) => !deltaker.roller.includes(MotedeltakerRolle.BRUKER))
                            .map((deltaker, index) => {
                                const navn = deltaker.navn.trim();
                                const roller = deltaker.roller.map((rolle) => motedeltakerRolleTekst[rolle]).join(', ');
                                const visRoller = roller.length > 0;
                                return (
                                    <BodyShort as="li" key={deltaker.deltakerId ?? index}>
                                        {navn ? `${navn}${visRoller ? ` (${roller})` : ''}` : roller}
                                    </BodyShort>
                                );
                            })}
                    </ul>
                }
            />
            <Informasjonsfelt
                key="adresse"
                tittel="Møtested eller annen praktisk informasjon"
                innhold={aktivitet.adresse}
                formattertTekst
                fullbredde
            />
            <Informasjonsfelt
                key="bakgrunn"
                tittel="Hensikt med møtet"
                innhold={aktivitet.beskrivelse}
                formattertTekst
                fullbredde
            />
            <Informasjonsfelt
                key="forberedelser"
                tittel="Forberedelser til møtet"
                innhold={aktivitet.forberedelser}
                formattertTekst
                fullbredde
            />
        </>
    );
};

export default MoteDetaljer;
