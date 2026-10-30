import React, { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { doLesAktivitetsplan } from '../../api/oppfolgingAPI';
import { AKTIVITETSPLAN_ROOT_NODE_ID, TabId } from '../../constant';
import { Status } from '../../store/createGenericSlice';
import { AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { TabChangeEvent } from '../../datatypes/types';
import { useEventListener } from '../../felles-komponenter/hooks/useEventListner';
import { logTimeToAktivitestavlePaint } from '../../felles-komponenter/utils/logging';
import { prefixAktivtetskortId } from '../../moduler/aktivitet/aktivitet-kort/Aktivitetskort';
import { selectAktivitetStatus } from '../../moduler/aktivitet/aktivitet-selector';
import { selectSistVisteAktivitet } from '../../moduler/aktivitet/aktivitetview-selector';
import { selectArenaAktivitetStatus } from '../../moduler/aktivitet/arena-aktivitet-selector';
import { useErVeileder, useFnrOgEnhetContext } from '../../Provider';
import useIsVisible from '../../utils/useIsVisible';
import Aktivitetskolonner from './Aktivitetskolonner';
import { Await, useRouteLoaderData } from 'react-router';
import { InitialPageLoadResult } from '../../routing/loaders';
import { Loader } from '@navikt/ds-react';
import { RootState } from '../../store/rootReducer';

function LogTimeToAktivitestavlePaint(props: { erVeileder: boolean }) {
    useEffect(() => {
        logTimeToAktivitestavlePaint(props.erVeileder);
    }, [props.erVeileder]);

    return null;
}

const Aktivitetstavle = () => {
    const { fnr } = useFnrOgEnhetContext();

    const statusAktiviteter = useSelector(selectAktivitetStatus);
    const statusArenaAktiviteter = useSelector(selectArenaAktivitetStatus);
    const erVeileder = useErVeileder();

    const aktivitetNotStarted =
        statusAktiviteter === Status.NOT_STARTED && statusArenaAktiviteter === Status.NOT_STARTED;

    useEffect(() => {
        if (aktivitetNotStarted) {
            if (erVeileder && fnr) {
                doLesAktivitetsplan(fnr);
            }
        }
    }, [aktivitetNotStarted, erVeileder, fnr]);

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

    const { oppfolging } = useRouteLoaderData('root') as InitialPageLoadResult;

    return (
        <Suspense fallback={<TavleFallback />}>
            <Await resolve={oppfolging}>
                <div className="flex w-full m-auto mt-8">
                    <LogTimeToAktivitestavlePaint erVeileder={erVeileder} />
                    <Aktivitetskolonner />
                </div>
            </Await>
        </Suspense>
    );
};

const TavleFallback = () => {
    return (
        <div className="flex m-auto w-full mt-8 flex-col">
            <Aktivitetskolonner />
            <Loader size="large" className="self-center mb-32" />
        </div>
    );
};

export default Aktivitetstavle;
