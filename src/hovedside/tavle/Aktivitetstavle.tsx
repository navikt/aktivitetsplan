import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Tavle from './tavle';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-reducer';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { STATUS } from '../../ducks/utils';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';
import { doLesAktivitetsplan } from '../../moduler/oppfolging-status/oppfolging-api';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../constant';
import KolonneFunction from './kolonne/kolonnefunction';
import DragbartAktivitetskort from '../../moduler/aktivitet/aktivitet-kort/DragbartAktivitetskort';
import SkjulEldreAktiviteter from './kolonne/skjul-eldre-aktiviteter-fra-kolonne';
import { splitIEldreOgNyereAktiviteter } from '../../moduler/aktivitet/aktivitet-util';
import { hentNivaa4 } from '../../moduler/tilgang/tilgang-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import Tavleadvarsel from './Tavleadvarsel';
import { Aktivitet } from '../../types';
import { selectDraggingAktivitet } from '../../moduler/aktivitet/aktivitet-kort/dragAndDropReducer';
import { selectUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { erDroppbar } from './tavleUtils';
import classNames from 'classnames';

function lagAktivitetsListe(aktiviteter: Aktivitet[]) {
    return aktiviteter.map((aktivitet) => <DragbartAktivitetskort key={aktivitet.id} aktivitet={aktivitet} />);
}

function renderFullFortAvbryt(aktiviteter: Aktivitet[]) {
    const { nyereAktiviteter, eldreAktiviteter } = splitIEldreOgNyereAktiviteter(aktiviteter);
    return (
        <div>
            {lagAktivitetsListe(nyereAktiviteter)}
            <SkjulEldreAktiviteter aktiviteteterTilDatoMerEnnToManederSiden={eldreAktiviteter} />
        </div>
    );
}

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
            <Tavleadvarsel hidden={skjulAdvarsel} />

            <Tavle
                defaultStartKolonne={1}
                antallKolonner={3}
                className={classNames('aktivitetstavle', !skjulAdvarsel && 'aktivitetstavle-advarsel')}
            >
                <KolonneFunction status={STATUS_BRUKER_ER_INTRESSERT} render={lagAktivitetsListe} />
                <KolonneFunction status={STATUS_PLANLAGT} render={lagAktivitetsListe} />
                <KolonneFunction status={STATUS_GJENNOMFOERT} render={lagAktivitetsListe} />
                <KolonneFunction status={STATUS_FULLFOERT} render={renderFullFortAvbryt} />
                <KolonneFunction status={STATUS_AVBRUTT} render={renderFullFortAvbryt} />
            </Tavle>
        </Innholdslaster>
    );
}

export default AktivitetsTavle;
