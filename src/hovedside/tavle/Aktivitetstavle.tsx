import classNames from 'classnames';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { doLesAktivitetsplan } from '../../api/oppfolgingAPI';
import { STATUS } from '../../api/utils';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../constant';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { selectDraggingAktivitet } from '../../moduler/aktivitet/aktivitet-kort/dragAndDropReducer';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-reducer';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { selectUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { hentNivaa4 } from '../../moduler/tilgang/tilgang-reducer';
import { getFodselsnummer } from '../../utils/fnr-util';
import Kolonne from './kolonne/Kolonne';
import KolonneSomSkjulerEldreAktiviteter from './kolonne/KolonneSomSkjulerEldreAktiviteter';
import Tavle from './tavle';
import Tavleadvarsel from './Tavleadvarsel';
import { erDroppbar } from './tavleUtils';

function AktivitetsTavle() {
    const dispatch = useDispatch();

    const statusAktiviteter = useSelector(selectAktivitetStatus);
    const statusArenaAktiviteter = useSelector(selectArenaAktivitetStatus);
    const erVeileder = useSelector(selectErVeileder);
    const draggingAktivitet = useSelector(selectDraggingAktivitet, shallowEqual);
    const underOppfolging = useSelector(selectUnderOppfolging);

    const aktivitetNotStarted =
        statusAktiviteter === STATUS.NOT_STARTED && statusArenaAktiviteter === STATUS.NOT_STARTED;

    const avhengigheter = [statusAktiviteter, statusArenaAktiviteter];

    useEffect(() => {
        if (aktivitetNotStarted) {
            if (erVeileder) {
                doLesAktivitetsplan();
                dispatch(hentNivaa4(getFodselsnummer()));
            }
            dispatch(hentAktiviteter());
            dispatch(hentArenaAktiviteter());
        }
    }, [aktivitetNotStarted, erVeileder, dispatch]);

    const dragging = !!draggingAktivitet;
    const droppable = !!draggingAktivitet && erDroppbar(draggingAktivitet, !erVeileder, underOppfolging);
    const skjulAdvarsel = !dragging || droppable;

    return (
        <Innholdslaster minstEn avhengigheter={avhengigheter}>
            <Tavleadvarsel hidden={skjulAdvarsel} draggingAktivitet={draggingAktivitet} erVeileder={erVeileder} />

            <Tavle
                defaultStartKolonne={1}
                antallKolonner={3}
                className={classNames('aktivitetstavle', !skjulAdvarsel && 'aktivitetstavle-advarsel')}
            >
                <Kolonne status={STATUS_BRUKER_ER_INTRESSERT} />
                <Kolonne status={STATUS_PLANLAGT} />
                <Kolonne status={STATUS_GJENNOMFOERT} />
                <KolonneSomSkjulerEldreAktiviteter status={STATUS_FULLFOERT} />
                <KolonneSomSkjulerEldreAktiviteter status={STATUS_AVBRUTT} />
            </Tavle>
        </Innholdslaster>
    );
}

export default AktivitetsTavle;
