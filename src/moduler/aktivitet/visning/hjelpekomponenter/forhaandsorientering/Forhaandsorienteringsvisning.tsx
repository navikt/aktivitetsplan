import { Alert, BodyLong, BodyShort, Heading, ReadMore } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { Status } from '../../../../../createGenericSlice';
import { AlleAktiviteter, isArenaAktivitet } from '../../../../../datatypes/aktivitetTypes';
import useAppDispatch from '../../../../../felles-komponenter/hooks/useAppDispatch';
import { loggForhaandsorienteringLest } from '../../../../../felles-komponenter/utils/logging';
import { formaterDatoManed } from '../../../../../utils/dateUtils';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import { markerForhaandsorienteringSomLest } from '../../../aktivitet-actions';
import { selectAktivitetFhoLestStatus } from '../../../aktivitet-selector';
import { selectArenaAktivitetFhoLestStatus } from '../../../arena-aktivitet-selector';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../../arena-aktiviteter-reducer';
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
    const arenaAktivitetFhoLestStatus = useSelector(selectArenaAktivitetFhoLestStatus);
    const aktivitetFhoLestStatus = useSelector(selectAktivitetFhoLestStatus);

    const dispatch = useAppDispatch();

    const kanMarkeresSomLest = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    const [erEkspandert, setErEkspandert] = useState(startAapen);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onMarkerSomLest = () => {
        if (erArenaAktivitet) {
            dispatch(markerForhaandsorienteringSomLestArenaAktivitet(aktivitet));
        } else {
            dispatch(markerForhaandsorienteringSomLest(aktivitet));
        }
        loggForhaandsorienteringLest(aktivitet.type, true);
    };

    const onClickLestKnapp = () => {
        onMarkerSomLest && onMarkerSomLest();
        setErEkspandert(false);
    };

    const lasterDataArena = arenaAktivitetFhoLestStatus === Status.PENDING;
    const lasterDataAktivitet = aktivitetFhoLestStatus === Status.PENDING;
    const lasterData = erArenaAktivitet ? lasterDataArena : lasterDataAktivitet;

    if (!erLest && kanMarkeresSomLest) {
        return (
            <Alert variant="warning">
                <Heading size="xsmall" level="2">
                    {tittelTekst}
                </Heading>
                <BodyLong>{forhaandsorienteringTekst}</BodyLong>
                <LestKnapp onClick={onClickLestKnapp} lasterData={lasterData} />
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
