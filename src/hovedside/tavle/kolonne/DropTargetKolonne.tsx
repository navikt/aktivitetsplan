import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { flyttetAktivitetMetrikk } from '../../../felles-komponenter/utils/logging';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { selectDraggingAktivitet } from '../../../moduler/aktivitet/aktivitet-kort/dragAndDropSlice';
import { useRoutes } from '../../../routing/useRoutes';
import { erDroppbar } from '../tavleUtils';
import { ReadWriteMode, selectReadWriteMode } from '../../../utils/readOrWriteModeSlice';
import { useErVeileder } from '../../../Provider';

interface Props {
    status: AktivitetStatus;
    children: ReactNode;
}

interface DragItem<AktivitetsType> {
    aktivitet: AktivitetsType;
    type: string;
}

export const DROP_TYPE = 'AktivitetsKort';

function DropTargetKolonne({ status, children }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const erVeileder = useErVeileder();
    const readOnly = useSelector(selectReadWriteMode) == ReadWriteMode.READ;
    const draggingAktivitet = useSelector(selectDraggingAktivitet, shallowEqual);
    const { avbrytAktivitetRoute, fullforAktivitetRoute } = useRoutes();

    const [collectedProps, dropRef] = useDrop({
        accept: DROP_TYPE,
        canDrop: ({ aktivitet }: DragItem<VeilarbAktivitet>) =>
            status !== aktivitet.status && erDroppbar(aktivitet, !erVeileder, readOnly),
        drop: ({ aktivitet }: DragItem<VeilarbAktivitet>) => {
            flyttetAktivitetMetrikk('dragAndDrop', aktivitet, status);
            if (status === AktivitetStatus.FULLFOERT) {
                navigate(fullforAktivitetRoute(aktivitet.id));
            } else if (status === AktivitetStatus.AVBRUTT) {
                navigate(avbrytAktivitetRoute(aktivitet.id));
            } else {
                dispatch(flyttAktivitet({ aktivitet, status }));
            }
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    const isDragging = !!draggingAktivitet;
    const isOverAndCanDrop = collectedProps.canDrop && collectedProps.isOver;

    return (
        // @ts-ignore
        <div ref={dropRef} className="z-50 h-full">
            <div
                className={classNames(
                    'bg-ax-bg-neutral-soft border-t border-ax-border-neutral-subtle rounded-none p-4 sm:p-4 lg:p-2 m-0 sm:border-t-0 sm:rounded-md aktivitetstavle__kolonne',
                    {
                        'opacity-50': isDragging && !isOverAndCanDrop,
                        'bg-ax-bg-accent-moderate-hover ': isOverAndCanDrop,
                    },
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default DropTargetKolonne;
