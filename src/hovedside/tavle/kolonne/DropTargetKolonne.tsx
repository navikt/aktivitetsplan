import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnyAction } from 'redux';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { flyttetAktivitetMetrikk } from '../../../felles-komponenter/utils/logging';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { selectDraggingAktivitet } from '../../../moduler/aktivitet/aktivitet-kort/dragAndDropReducer';
import { selectErBruker } from '../../../moduler/identitet/identitet-selector';
import { selectErUnderOppfolging } from '../../../moduler/oppfolging-status/oppfolging-selector';
import { useRoutes } from '../../../routes';
import { erDroppbar } from '../tavleUtils';

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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const erBruker = useSelector(selectErBruker, shallowEqual);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const draggingAktivitet = useSelector(selectDraggingAktivitet, shallowEqual);
    const { avbrytAktivitetRoute, fullforAktivitetRoute } = useRoutes();

    const [collectedProps, drop] = useDrop({
        accept: DROP_TYPE,
        canDrop: ({ aktivitet }: DragItem<AlleAktiviteter>) =>
            status !== aktivitet.status && erDroppbar(aktivitet, erBruker, erUnderOppfolging),
        drop: ({ aktivitet }: DragItem<VeilarbAktivitet>) => {
            flyttetAktivitetMetrikk('dragAndDrop', aktivitet, status);
            if (status === AktivitetStatus.FULLFOERT) {
                navigate(fullforAktivitetRoute(aktivitet.id));
            } else if (status === AktivitetStatus.AVBRUTT) {
                navigate(avbrytAktivitetRoute(aktivitet.id));
            } else {
                dispatch(flyttAktivitet(aktivitet, status) as unknown as AnyAction);
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
        <div ref={drop} className="z-50 h-full">
            <div
                className={classNames(
                    'bg-bg-subtle border-t border-border-divider rounded-none p-4 sm:p-2 m-0 sm:border-t-0 sm:rounded-md aktivitetstavle__kolonne',
                    {
                        'opacity-50': isDragging && !isOverAndCanDrop,
                        'bg-surface-action-subtle-hover ': isOverAndCanDrop,
                    }
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default DropTargetKolonne;
