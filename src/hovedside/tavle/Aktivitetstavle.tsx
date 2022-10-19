import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, shallowEqual, useDispatch, useSelector } from 'react-redux';

import { doLesAktivitetsplan } from '../../api/oppfolgingAPI';
import { STATUS } from '../../api/utils';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../constant';
import { useEventListener } from '../../felles-komponenter/hooks/useEventListner';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { hentAktiviteter } from '../../moduler/aktivitet/aktivitet-actions';
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
    let sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) => `aktivitetskort-` + selectSistVisteAktivitet(state)?.id
    );

    let [skalScrolleTil, setSkalScrolleTil] = useState(false);

    console.log('Rendered Aktivitetstavle');
    useEventListener('veilarbpersonflatefs.tab-clicked', () => {
        console.log('Oppdaget event tab-clicked fra veilarbpersonflatefs - setter skal SCrolle TRUE');
        setSkalScrolleTil(true);
    });

    useEffect(() => {
        console.log(`Sjekker om vi skal scrolle: skalScrolleTil = ${skalScrolleTil}`);
        if (skalScrolleTil) {
            console.log('Scroller og setter skalScrolleTil FALSE');
            const element = document.getElementById(sistVisteAktivitetId);
            if (element) {
                console.log(`scroller til element `, element);
                element?.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center',
                });
                setSkalScrolleTil(false);
            } else {
                console.log('Scroller IKKE fordi HTML-elementet ikke er truthy: ', element);
            }
        }
    }, [sistVisteAktivitetId, skalScrolleTil]);

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
