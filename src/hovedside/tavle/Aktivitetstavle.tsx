import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, shallowEqual, useDispatch, useSelector } from 'react-redux';

import { doLesAktivitetsplan } from '../../api/oppfolgingAPI';
import { STATUS } from '../../api/utils';
import { AKTIVITETSPLAN_ROOT_NODE_ID } from '../../app';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
    TabId,
} from '../../constant';
import { TabChangeEvent } from '../../datatypes/types';
import { useEventListener } from '../../felles-komponenter/hooks/useEventListner';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
import { prefixAktivtetskortId } from '../../moduler/aktivitet/aktivitet-kort/Aktivitetskort';
import { selectDraggingAktivitet } from '../../moduler/aktivitet/aktivitet-kort/dragAndDropReducer';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-reducer';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';
import { hentArenaAktiviteter } from '../../moduler/aktivitet/arena-aktiviteter-reducer';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import { selectUnderOppfolging } from '../../moduler/oppfolging-status/oppfolging-selector';
import { hentNivaa4 } from '../../moduler/tilgang/tilgang-reducer';
import { hentVeilederInfo } from '../../moduler/veileder/veilederReducer';
import { hentFnrFraUrl } from '../../utils/fnr-util';
import useIsVisible from '../../utils/useIsVisible';
import Kolonne from './kolonne/Kolonne';
import KolonneSomSkjulerEldreAktiviteter from './kolonne/KolonneSomSkjulerEldreAktiviteter';
import Tavle from './Tavle';
import Tavleadvarsel from './Tavleadvarsel';
import { erDroppbar } from './tavleUtils';

const Aktivitetstavle = () => {
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
                dispatch(hentNivaa4(hentFnrFraUrl()));
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
    const sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>((state) => {
        const id = selectSistVisteAktivitet(state)?.id;
        return !!id ? prefixAktivtetskortId(id) : 'no-element';
    });
    const appIsVisible = useIsVisible(document.getElementById(AKTIVITETSPLAN_ROOT_NODE_ID));
    console.log({ appIsVisible });
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
        <Innholdslaster minstEn avhengigheter={avhengigheter}>
            <Tavleadvarsel hidden={skjulAdvarsel} draggingAktivitet={draggingAktivitet} erVeileder={erVeileder} />

            <Tavle className={classNames('aktivitetstavle', !skjulAdvarsel && 'aktivitetstavle-advarsel')}>
                <Kolonne status={STATUS_BRUKER_ER_INTRESSERT} />
                <Kolonne status={STATUS_PLANLAGT} />
                <Kolonne status={STATUS_GJENNOMFOERT} />
                <KolonneSomSkjulerEldreAktiviteter status={STATUS_FULLFOERT} />
                <KolonneSomSkjulerEldreAktiviteter status={STATUS_AVBRUTT} />
            </Tavle>
        </Innholdslaster>
    );
};

export default Aktivitetstavle;
