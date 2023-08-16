import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { doLesAktivitetsplan } from '../../api/oppfolgingAPI';
import { AKTIVITETSPLAN_ROOT_NODE_ID, TabId } from '../../constant';
import { Status } from '../../createGenericSlice';
import { AktivitetStatus, AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { TabChangeEvent } from '../../datatypes/types';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useEventListener } from '../../felles-komponenter/hooks/useEventListner';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { logTimeToAktivitestavlePaint } from '../../felles-komponenter/utils/logging';
import UxSignalsWidget from '../../felles-komponenter/UxSignalsWidget';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { prefixAktivtetskortId } from '../../moduler/aktivitet/aktivitet-kort/Aktivitetskort';
import { selectDraggingAktivitet } from '../../moduler/aktivitet/aktivitet-kort/dragAndDropSlice';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-selector';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-slice';
import { selectUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { hentNivaa4 } from '../../moduler/tilgang/tilgang-slice';
import { hentVeilederInfo } from '../../moduler/veileder/veileder-slice';
import { useErVeileder, useFnr } from '../../Provider';
import { RootState } from '../../store';
import useIsVisible from '../../utils/useIsVisible';
import Kolonne from './kolonne/Kolonne';
import KolonneSomSkjulerEldreAktiviteter from './kolonne/KolonneSomSkjulerEldreAktiviteter';
import Tavle from './Tavle';
import { Tavleadvarsel } from './Tavleadvarsel';
import { erDroppbar } from './tavleUtils';

function LogTimeToAktivitestavlePaint(props: { erVeileder: boolean }) {
    useEffect(() => {
        logTimeToAktivitestavlePaint(props.erVeileder);
    }, [props.erVeileder]);

    return null;
}

const Aktivitetstavle = () => {
    const dispatch = useAppDispatch();
    const fnr = useFnr();

    const statusAktiviteter = useSelector(selectAktivitetStatus);
    const statusArenaAktiviteter = useSelector(selectArenaAktivitetStatus);
    const erVeileder = useErVeileder();
    const draggingAktivitet = useSelector(selectDraggingAktivitet, shallowEqual);
    const underOppfolging = useSelector(selectUnderOppfolging);

    const aktivitetNotStarted =
        statusAktiviteter === Status.NOT_STARTED && statusArenaAktiviteter === Status.NOT_STARTED;

    const avhengigheter = [statusAktiviteter, statusArenaAktiviteter];

    useEffect(() => {
        if (aktivitetNotStarted) {
            if (erVeileder && fnr) {
                doLesAktivitetsplan(fnr);
                dispatch(hentNivaa4(fnr));
                dispatch(hentVeilederInfo());
            }
            dispatch(hentAktiviteter());
            dispatch(hentArenaAktiviteter());
        }
    }, [aktivitetNotStarted, erVeileder, dispatch]);

    const dragging = !!draggingAktivitet;
    const droppable = !!draggingAktivitet && erDroppbar(draggingAktivitet, !erVeileder, underOppfolging);
    const skjulAdvarsel = !dragging || droppable;

    // SCROLLING //
    const sistVisteAktivitetId: string = useSelector((state: RootState) => {
        const aktivitet: AlleAktiviteter | undefined = selectSistVisteAktivitet(state);
        return aktivitet ? prefixAktivtetskortId(aktivitet) : 'no-element';
    });
    const appIsVisible = useIsVisible(document.getElementById(AKTIVITETSPLAN_ROOT_NODE_ID));
    const [skalScrolle, setSkalScrolle] = useState(false);
    useEventListener<TabChangeEvent>('veilarbpersonflatefs.tab-clicked', (event) => {
        if (TabId.AKTIVITETSPLAN !== event.detail?.tabId) return;
        setSkalScrolle(true);
    });
    useEffect(() => {
        const element = document.getElementById(sistVisteAktivitetId);
        if (element && skalScrolle && appIsVisible) {
            element.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center',
            });
            setSkalScrolle(false);
        }
    }, [sistVisteAktivitetId, skalScrolle, appIsVisible]);

    return (
        <Innholdslaster className="flex m-auto mt-8" minstEn avhengigheter={avhengigheter}>
            <Tavleadvarsel hidden={skjulAdvarsel} draggingAktivitet={draggingAktivitet} erVeileder={erVeileder} />
            <LogTimeToAktivitestavlePaint erVeileder={erVeileder} />

            <Tavle dragging={dragging}>
                <Kolonne status={AktivitetStatus.BRUKER_ER_INTRESSERT} />
                <Kolonne status={AktivitetStatus.PLANLAGT} />
                <Kolonne status={AktivitetStatus.GJENNOMFOERT} />
                <KolonneSomSkjulerEldreAktiviteter status={AktivitetStatus.FULLFOERT} />
                <KolonneSomSkjulerEldreAktiviteter status={AktivitetStatus.AVBRUTT} />
            </Tavle>
            <UxSignalsWidget />
        </Innholdslaster>
    );
};

export default Aktivitetstavle;
