import React, { Profiler, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router';

import { AktivitetStatus, AlleAktiviteter, isVeilarbAktivitet } from '../../datatypes/aktivitetTypes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { flyttetAktivitetMetrikk } from '../../felles-komponenter/utils/logging';
import { flyttAktivitet } from '../../moduler/aktivitet/aktivitet-actions';
import { compareAktivitet, sorterAktiviteter } from '../../moduler/aktivitet/aktivitet-util';
import { selectAktivitetListe } from '../../moduler/aktivitet/aktivitetlisteSelector';
import AktivitetskortDragOverlay from '../../moduler/aktivitet/aktivitet-kort/AktivitetskortDragOverlay';
import {
    AktivitetskortDragData,
    DROP_TYPE_AKTIVITETSKORT,
    startDragging,
    stopDragging,
} from '../../moduler/aktivitet/aktivitet-kort/dragAndDropSlice';
import { useErVeileder } from '../../Provider';
import { useRoutes } from '../../routing/useRoutes';
import { RootState } from '../../store/rootReducer';
import { ReadWriteMode, selectReadWriteMode } from '../../utils/readOrWriteModeSlice';
import Kolonne from './kolonne/Kolonne';
import KolonneSomSkjulerEldreAktiviteter from './kolonne/KolonneSomSkjulerEldreAktiviteter';
import Tavle from './Tavle';
import { aktivitetDropTargetStatus, erDroppbar } from './tavleUtils';

export type TavleAktivitet = AlleAktiviteter & { nesteStatus?: AktivitetStatus };
type Kolonner = Record<AktivitetStatus, TavleAktivitet[]>;
const statuser = Object.values(AktivitetStatus);

function grupper(aktiviteter: AlleAktiviteter[]): Kolonner {
    return Object.fromEntries(statuser.map((status) => [status, sorterAktiviteter(aktiviteter, status)])) as Kolonner;
}

function flyttTilToppen(kolonner: Kolonner, aktivitet: TavleAktivitet, status: AktivitetStatus): Kolonner {
    return Object.fromEntries(
        statuser.map((gruppe) => [
            gruppe,
            gruppe === status
                ? [aktivitet, ...kolonner[gruppe].filter((kort) => kort.id !== aktivitet.id)]
                : kolonner[gruppe].filter((kort) => kort.id !== aktivitet.id),
        ]),
    ) as Kolonner;
}

function beholdVentende(kanoniske: Kolonner, lokale: Kolonner): Kolonner {
    const aktiviteter = Object.values(kanoniske).flat();
    return Object.values(lokale)
        .flat()
        .reduceRight((kolonner, aktivitet) => {
            if (!aktivitet.nesteStatus) return kolonner;
            const oppdatert = aktiviteter.find((kort) => kort.id === aktivitet.id);
            return oppdatert
                ? flyttTilToppen(kolonner, { ...oppdatert, nesteStatus: aktivitet.nesteStatus }, aktivitet.nesteStatus)
                : kolonner;
        }, kanoniske);
}

function avklarFlytting(lokale: Kolonner, kanoniske: Kolonner, id: string): Kolonner {
    const kolonner = Object.fromEntries(
        statuser.map((status) => [status, lokale[status].filter((kort) => kort.id !== id)]),
    ) as Kolonner;
    for (const status of statuser) {
        const aktivitet = kanoniske[status].find((kort) => kort.id === id);
        if (!aktivitet) continue;
        kolonner[status] = [...kolonner[status], aktivitet].sort((a, b) => {
            const aFlyttet = !!a.nesteStatus || a.status !== status;
            const bFlyttet = !!b.nesteStatus || b.status !== status;
            if (aFlyttet || bFlyttet) return Number(bFlyttet) - Number(aFlyttet);
            return compareAktivitet(a, b);
        });
    }
    return kolonner;
}

export default function Aktivitetskolonner({
    children,
    ...options
}: React.PropsWithChildren<Pick<React.ComponentProps<typeof DragDropProvider>, 'plugins' | 'sensors'>>) {
    const dispatch = useAppDispatch();
    const store = useStore<RootState>();
    const navigate = useNavigate();
    const { fullforAktivitetRoute, avbrytAktivitetRoute } = useRoutes();
    const erVeileder = useErVeileder();
    const readOnly = useSelector(selectReadWriteMode) === ReadWriteMode.READ;
    const aktiviteter = useSelector(selectAktivitetListe);
    const kanoniske = useMemo(() => grupper(aktiviteter), [aktiviteter]);
    const [kolonner, setKolonner] = useState(kanoniske);
    const snapshot = useRef<Kolonner | null>(null);
    const dragStartedAt = useRef<number | null>(null);

    useEffect(() => {
        if (!snapshot.current) setKolonner((lokale) => beholdVentende(kanoniske, lokale));
    }, [kanoniske]);

    const logDragRender: React.ProfilerOnRenderCallback = (
        id,
        phase,
        actualDuration,
        baseDuration,
        _startTime,
        commitTime,
    ) => {
        if (!import.meta.env.DEV || dragStartedAt.current === null) return;
        const elapsed = commitTime - dragStartedAt.current;
        if (elapsed > 500) return;
        console.log('drag-start React render:', {
            id,
            phase,
            actualDuration,
            baseDuration,
            millisecondsSinceDragStart: elapsed,
        });
    };

    return (
        <DragDropProvider<AktivitetskortDragData>
            {...options}
            onDragStart={({ operation }) => {
                if (operation.source?.type !== DROP_TYPE_AKTIVITETSKORT) return;
                snapshot.current = kolonner;
                const started = performance.now();
                if (import.meta.env.DEV) {
                    dragStartedAt.current = started;
                    performance.mark('activity-drag:start');
                }
                dispatch(startDragging(operation.source.data.aktivitet));

                if (import.meta.env.DEV) {
                    console.log('startDragging dispatch:', performance.now() - started, 'ms');
                    performance.mark('activity-drag:dispatch-returned');
                    performance.measure(
                        'activity-drag:dispatch',
                        'activity-drag:start',
                        'activity-drag:dispatch-returned',
                    );
                    requestAnimationFrame(() => {
                        console.log('drag start → next frame callback:', performance.now() - started, 'ms');
                        performance.mark('activity-drag:next-frame');
                        performance.measure(
                            'activity-drag:until-next-frame',
                            'activity-drag:start',
                            'activity-drag:next-frame',
                        );
                        requestAnimationFrame(() => {
                            console.log('drag start → following frame callback:', performance.now() - started, 'ms');
                            performance.mark('activity-drag:following-frame');
                            performance.measure(
                                'activity-drag:until-following-frame',
                                'activity-drag:start',
                                'activity-drag:following-frame',
                            );
                        });
                    });
                }
            }}
            onDragOver={({ operation }) => {
                const source = operation.source;
                const status = aktivitetDropTargetStatus(operation);
                if (source?.type !== DROP_TYPE_AKTIVITETSKORT || !status) return;
                const aktivitet = source.data.aktivitet;
                if (!erDroppbar(aktivitet, !erVeileder, readOnly)) return;
                setKolonner((lokale) => {
                    if (lokale[status].some((kort) => kort.id === aktivitet.id)) return lokale;
                    return status === aktivitet.status && snapshot.current
                        ? snapshot.current
                        : flyttTilToppen(lokale, aktivitet, status);
                });
            }}
            onDragEnd={({ operation, canceled }) => {
                const source = operation.source;
                if (source?.type !== DROP_TYPE_AKTIVITETSKORT) return;
                const aktivitet = source.data.aktivitet;
                const status = aktivitetDropTargetStatus(operation);
                const tidligere = snapshot.current ?? kolonner;
                snapshot.current = null;
                dispatch(stopDragging());
                if (
                    canceled ||
                    !status ||
                    status === aktivitet.status ||
                    !erDroppbar(aktivitet, !erVeileder, readOnly) ||
                    !isVeilarbAktivitet(aktivitet)
                ) {
                    setKolonner(beholdVentende(kanoniske, tidligere));
                    return;
                }
                flyttetAktivitetMetrikk('dragAndDrop', aktivitet, status);
                if (status === AktivitetStatus.FULLFOERT || status === AktivitetStatus.AVBRUTT) {
                    setKolonner(beholdVentende(kanoniske, tidligere));
                    navigate(
                        status === AktivitetStatus.FULLFOERT
                            ? fullforAktivitetRoute(aktivitet.id)
                            : avbrytAktivitetRoute(aktivitet.id),
                    );
                    return;
                }
                setKolonner((lokale) => flyttTilToppen(lokale, { ...aktivitet, nesteStatus: status }, status));
                void dispatch(flyttAktivitet({ aktivitet, status })).then(() => {
                    const oppdatert = grupper(selectAktivitetListe(store.getState()));
                    // A different card may be dragging when this request settles.
                    if (snapshot.current) snapshot.current = avklarFlytting(snapshot.current, oppdatert, aktivitet.id);
                    setKolonner((lokale) => {
                        const avklart = avklarFlytting(lokale, oppdatert, aktivitet.id);
                        return snapshot.current ? avklart : beholdVentende(oppdatert, avklart);
                    });
                });
            }}
        >
            <Profiler id="activity-drag-overlay" onRender={logDragRender}>
                <AktivitetskortDragOverlay />
            </Profiler>
            <Profiler id="activity-drag-board" onRender={logDragRender}>
                {children}
                <Tavle>
                    {statuser.map((status) =>
                        status === AktivitetStatus.FULLFOERT || status === AktivitetStatus.AVBRUTT ? (
                            <KolonneSomSkjulerEldreAktiviteter
                                key={status}
                                status={status}
                                aktiviteter={kolonner[status]}
                            />
                        ) : (
                            <Kolonne key={status} status={status} aktiviteter={kolonner[status]} />
                        ),
                    )}
                </Tavle>
            </Profiler>
        </DragDropProvider>
    );
}
