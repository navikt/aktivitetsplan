import React, { useEffect, useMemo, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AktivitetStatus, AlleAktiviteter, isVeilarbAktivitet } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { flyttetAktivitetMetrikk } from '../../felles-komponenter/utils/logging';
import { flyttAktivitet } from '../../moduler/aktivitet/aktivitet-actions';
import { sorterAktiviteter } from '../../moduler/aktivitet/aktivitet-util';
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
import { ReadWriteMode, selectReadWriteMode } from '../../utils/readOrWriteModeSlice';
import Kolonne from './kolonne/Kolonne';
import KolonneSomSkjulerEldreAktiviteter from './kolonne/KolonneSomSkjulerEldreAktiviteter';
import Tavle from './Tavle';
import { aktivitetDropTargetStatus, erDroppbar } from './tavleUtils';

export type TavleAktivitet = AlleAktiviteter & { pendingStatus?: AktivitetStatus };
type AktiviteterByStatus = Record<AktivitetStatus, TavleAktivitet[]>;
type Flytting = {
    aktivitetId: AlleAktiviteter['id'];
    tilStatus: AktivitetStatus;
    fase:
        | 'PREVIEW' /* brukes ved onDragOver */
        | 'PENDING_BACKEND_SYNC' /* pågående http requset til backend */
        | 'DONE' /* http-request ok, venter på redux skal synces */;
};
const statuser = Object.values(AktivitetStatus);

function grupperPåStatus(aktiviteter: AlleAktiviteter[]): AktiviteterByStatus {
    return Object.fromEntries(
        statuser.map((status) => [status, sorterAktiviteter(aktiviteter, status)]),
    ) as AktiviteterByStatus;
}

const flyttetAktivitetErIPreview = ({ fase }: Flytting) => fase === 'PREVIEW';
const flyttetAktivitetErIkkeIPreview = ({ fase }: Flytting) => fase !== 'PREVIEW';

type ResultatAvDragning =
    | {
          type:
              | 'DRAGNING_AVBRUTT'
              | 'SLUPPET_UTENFOR_KOLONNE'
              | 'SLUPPET_I_OPPRINNELIG_KOLONNE'
              | 'STATUSENDRING_IKKE_TILLATT';
      }
    | {
          type: 'FULLFORING_KREVER_BEKREFTELSE';
          aktivitet: VeilarbAktivitet;
          status: AktivitetStatus.FULLFOERT;
      }
    | {
          type: 'AVBRYTING_AV_AKTIVITET_KREVER_BEKREFTELSE';
          aktivitet: VeilarbAktivitet;
          status: AktivitetStatus.AVBRUTT;
      }
    | { type: 'STATUSENDRING_KAN_LAGRES_DIREKTE'; aktivitet: VeilarbAktivitet; status: AktivitetStatus };

function finnResultatAvDragning(
    aktivitet: TavleAktivitet,
    status: AktivitetStatus | undefined,
    canceled: boolean,
    erVeileder: boolean,
    readOnly: boolean,
): ResultatAvDragning {
    if (canceled) return { type: 'DRAGNING_AVBRUTT' };
    if (!status) return { type: 'SLUPPET_UTENFOR_KOLONNE' };
    if (status === aktivitet.status) return { type: 'SLUPPET_I_OPPRINNELIG_KOLONNE' };
    if (!erDroppbar(aktivitet, !erVeileder, readOnly) || !isVeilarbAktivitet(aktivitet)) {
        return { type: 'STATUSENDRING_IKKE_TILLATT' };
    }
    if (status === AktivitetStatus.FULLFOERT) {
        return { type: 'FULLFORING_KREVER_BEKREFTELSE', aktivitet, status };
    }
    if (status === AktivitetStatus.AVBRUTT) {
        return { type: 'AVBRYTING_AV_AKTIVITET_KREVER_BEKREFTELSE', aktivitet, status };
    }
    return { type: 'STATUSENDRING_KAN_LAGRES_DIREKTE', aktivitet, status };
}

export default function Aktivitetskolonner({
    children,
    ...options
}: React.PropsWithChildren<Pick<React.ComponentProps<typeof DragDropProvider>, 'plugins' | 'sensors'>>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { fullforAktivitetRoute, avbrytAktivitetRoute } = useRoutes();
    const erVeileder = useErVeileder();
    const readOnly = useSelector(selectReadWriteMode) === ReadWriteMode.READ;
    const aktiviteter = useSelector(selectAktivitetListe);
    const kolonnerFraStore = useMemo(() => grupperPåStatus(aktiviteter), [aktiviteter]);
    const [flyttinger, setFlyttinger] = useState<Flytting[]>([]);

    const kolonnerMedFlyttinger = useMemo(() => {
        if (flyttinger.length === 0) return kolonnerFraStore;
        const aktivitetsIderMedFlytting = new Set(flyttinger.map(({ aktivitetId }) => aktivitetId));
        const synligeAktiviteterEtterId = new Map(aktiviteter.map((aktivitet) => [aktivitet.id, aktivitet]));

        return Object.fromEntries(
            statuser.map((kolonneStatus) => {
                const aktiviteterFlyttetTilKolonnen = flyttinger
                    .filter((flytting) => flytting.tilStatus === kolonneStatus)
                    .flatMap((flytting) => {
                        const aktivitetFraStore = synligeAktiviteterEtterId.get(flytting.aktivitetId);
                        if (!aktivitetFraStore) return [];
                        return [
                            flytting.fase === 'PREVIEW'
                                ? aktivitetFraStore
                                : { ...aktivitetFraStore, pendingStatus: kolonneStatus },
                        ];
                    });
                const aktiviteterSomBeholderPlassering = kolonnerFraStore[kolonneStatus].filter(
                    ({ id }) => !aktivitetsIderMedFlytting.has(id),
                );
                return [kolonneStatus, [...aktiviteterFlyttetTilKolonnen, ...aktiviteterSomBeholderPlassering]];
            }),
        ) as AktiviteterByStatus;
    }, [aktiviteter, kolonnerFraStore, flyttinger]);

    useEffect(() => {
        // Keep placement until a render has read the Redux snapshot after request settlement.
        if (flyttinger.some(({ fase }) => fase === 'DONE')) {
            setFlyttinger((flyttinger) => flyttinger.filter(({ fase }) => fase !== 'DONE'));
        }
    }, [flyttinger]);

    function lagreStatusendring(aktivitet: VeilarbAktivitet, status: AktivitetStatus) {
        flyttetAktivitetMetrikk('dragAndDrop', aktivitet, status);
        setFlyttinger((flyttinger) => [
            { aktivitetId: aktivitet.id, tilStatus: status, fase: 'PENDING_BACKEND_SYNC' },
            ...flyttinger,
        ]);
        dispatch(flyttAktivitet({ aktivitet, status })).then(() => {
            setFlyttinger((flyttinger) =>
                flyttinger.map((flytting) =>
                    flytting.aktivitetId === aktivitet.id && flytting.fase === 'PENDING_BACKEND_SYNC'
                        ? { ...flytting, fase: 'DONE' }
                        : flytting,
                ),
            );
        });
    }

    return (
        <DragDropProvider<AktivitetskortDragData>
            {...options}
            onDragStart={({ operation }) => {
                if (operation.source?.type !== DROP_TYPE_AKTIVITETSKORT) return;
                dispatch(startDragging(operation.source.data.aktivitet));
            }}
            onDragOver={({ operation }) => {
                const source = operation.source;
                const status = aktivitetDropTargetStatus(operation);
                if (source?.type !== DROP_TYPE_AKTIVITETSKORT || !status) return;
                const aktivitet = source.data.aktivitet;
                if (!erDroppbar(aktivitet, !erVeileder, readOnly)) return;
                setFlyttinger((flyttinger) => {
                    const preview = flyttinger.find(({ fase }) => fase === 'PREVIEW');
                    if (status === aktivitet.status) {
                        return preview ? flyttinger.filter(({ fase }) => fase !== 'PREVIEW') : flyttinger;
                    }
                    if (preview?.aktivitetId === aktivitet.id && preview.tilStatus === status) return flyttinger;
                    return [
                        { aktivitetId: aktivitet.id, tilStatus: status, fase: 'PREVIEW' },
                        ...flyttinger.filter(({ fase }) => fase !== 'PREVIEW'),
                    ];
                });
            }}
            onDragEnd={({ operation, canceled }) => {
                const source = operation.source;
                if (source?.type !== DROP_TYPE_AKTIVITETSKORT) return;
                const resultat = finnResultatAvDragning(
                    source.data.aktivitet,
                    aktivitetDropTargetStatus(operation),
                    canceled,
                    erVeileder,
                    readOnly,
                );
                setFlyttinger((flyttinger) =>
                    flyttinger.some(flyttetAktivitetErIPreview)
                        ? flyttinger.filter(flyttetAktivitetErIkkeIPreview)
                        : flyttinger,
                );
                dispatch(stopDragging());
                switch (resultat.type) {
                    case 'DRAGNING_AVBRUTT':
                    case 'SLUPPET_UTENFOR_KOLONNE':
                    case 'SLUPPET_I_OPPRINNELIG_KOLONNE':
                    case 'STATUSENDRING_IKKE_TILLATT':
                        break;
                    case 'FULLFORING_KREVER_BEKREFTELSE':
                        flyttetAktivitetMetrikk('dragAndDrop', resultat.aktivitet, resultat.status);
                        navigate(fullforAktivitetRoute(resultat.aktivitet.id));
                        break;
                    case 'AVBRYTING_AV_AKTIVITET_KREVER_BEKREFTELSE':
                        flyttetAktivitetMetrikk('dragAndDrop', resultat.aktivitet, resultat.status);
                        navigate(avbrytAktivitetRoute(resultat.aktivitet.id));
                        break;
                    case 'STATUSENDRING_KAN_LAGRES_DIREKTE':
                        lagreStatusendring(resultat.aktivitet, resultat.status);
                        break;
                }
            }}
        >
            <AktivitetskortDragOverlay />
            {children}
            <Tavle>
                {statuser.map((status) =>
                    status === AktivitetStatus.FULLFOERT || status === AktivitetStatus.AVBRUTT ? (
                        <KolonneSomSkjulerEldreAktiviteter
                            key={status}
                            status={status}
                            aktiviteter={kolonnerMedFlyttinger[status]}
                        />
                    ) : (
                        <Kolonne key={status} status={status} aktiviteter={kolonnerMedFlyttinger[status]} />
                    ),
                )}
            </Tavle>
        </DragDropProvider>
    );
}
