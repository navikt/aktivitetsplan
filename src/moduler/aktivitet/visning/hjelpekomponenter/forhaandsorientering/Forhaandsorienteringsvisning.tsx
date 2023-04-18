import { Alert, BodyLong, BodyShort, Heading, ReadMore } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter, isArenaAktivitet } from '../../../../../datatypes/aktivitetTypes';
import useAppDispatch from '../../../../../felles-komponenter/hooks/useAppDispatch';
import { loggForhaandsorienteringLest } from '../../../../../felles-komponenter/utils/logging';
import { formaterDatoManed } from '../../../../../utils/dateUtils';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import { markerForhaandsorienteringSomLest } from '../../../aktivitet-actions';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../../arena-aktiviteter-slice';
import { skalMarkereForhaandsorienteringSomLest } from '../../avtalt-container/utilsForhaandsorientering';
import LestKnapp from './LestKnapp';

interface Props {
    aktivitet: AlleAktiviteter;
    startAapen?: boolean;
}

const tittelTekst = 'Informasjon om ansvaret ditt';

const Forhaandsorienteringsvisning = (props: Props) => {
    const { aktivitet, startAapen = false } = props;
    const erArenaAktivitet = isArenaAktivitet(aktivitet);

    const forhaandsorientering = aktivitet.forhaandsorientering;
    const forhaandsorienteringTekst = forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = forhaandsorientering?.lestDato;

    const erLest = !!forhaandsorienteringLestDato;

    const erBruker = useSelector(selectErBruker);

    const dispatch = useAppDispatch();

    const kanMarkeresSomLest = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    const [erEkspandert, setErEkspandert] = useState(startAapen);

    const [laster, setLaster] = useState(false);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onMarkerSomLest = () => {
        setLaster(true);
        if (erArenaAktivitet) {
            dispatch(markerForhaandsorienteringSomLestArenaAktivitet(aktivitet)).then((_) => setLaster(false));
        } else {
            dispatch(markerForhaandsorienteringSomLest(aktivitet)).then((_) => setLaster(false));
        }
        loggForhaandsorienteringLest(aktivitet.type, true);
    };

    const onClickLestKnapp = () => {
        onMarkerSomLest && onMarkerSomLest();
        setErEkspandert(false);
    };

    if (!erLest && kanMarkeresSomLest) {
        return (
            <Alert variant="warning">
                <Heading size="xsmall" level="2">
                    {tittelTekst}
                </Heading>
                <BodyLong>{forhaandsorienteringTekst}</BodyLong>
                <LestKnapp onClick={onClickLestKnapp} lasterData={laster} />
            </Alert>
        );
    }
    return (
        <ReadMore header={tittelTekst} open={erEkspandert} onClick={() => setErEkspandert(!erEkspandert)}>
            <BodyLong>{forhaandsorienteringTekst}</BodyLong>
            {erLest ? (
                <BodyShort className="mt-4">Lest {formaterDatoManed(forhaandsorienteringLestDato)}</BodyShort>
            ) : null}
        </ReadMore>
    );
};

export default Forhaandsorienteringsvisning;
