import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { MOTE_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { MotedeltakerRolle, motedeltakerRolleTekst } from '../../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../../Provider';
import { formaterDatoManed, norskTidSuffix } from '../../../../utils/dateUtils';
import { kanalMap } from '../../../../utils/textMappers';
import { beregnKlokkeslettVarighet, formatterKlokkeslett, formatterVarighet } from '../../aktivitet-util';
import Informasjonsfelt from '../hjelpekomponenter/Informasjonsfelt';
import { useSelector } from 'react-redux';
import { selectFeature } from '../../../feature/feature-selector';

interface Props {
    aktivitet: AlleAktiviteter;
}

const MoteDetaljer = ({ aktivitet }: Props) => {
    const erVeileder = useErVeileder();
    const erMotedeltakereEnabled = useSelector(selectFeature('aktivitetsplan.enableMotedeltakere'));
    if (aktivitet.type !== MOTE_TYPE) {
        return null;
    }

    const moteTid = beregnKlokkeslettVarighet(aktivitet);
    const motedeltakere = aktivitet.motedeltakere ?? [];

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
            {erMotedeltakereEnabled && motedeltakere.length > 0 && (
                <Informasjonsfelt
                    tittel="Deltakere"
                    fullbredde
                    innhold={
                        <ul role="list" className="list-none p-0 m-0">
                            {motedeltakere.map((deltaker) => {
                                const erBruker = deltaker.roller.includes(MotedeltakerRolle.BRUKER);
                                const navn = erBruker && !erVeileder ? 'Du' : deltaker.navn.trim();
                                const roller = deltaker.roller.map((rolle) => motedeltakerRolleTekst[rolle]).join(', ');
                                const visRoller = !erBruker && roller.length > 0;
                                return (
                                    <BodyShort as="li" key={`${deltaker.navn + deltaker.roller}`}>
                                        {navn ? `${navn}${visRoller ? ` (${roller})` : ''}` : roller}
                                    </BodyShort>
                                );
                            })}
                        </ul>
                    }
                />
            )}
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
