import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';
import { useHistory } from 'react-router-dom';
import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../constant';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { flyttetAktivitetMetrikk } from '../../../felles-komponenter/utils/logging';
import { avbrytAktivitetRoute, fullforAktivitetRoute } from '../../../routes';
import { Aktivitet, AktivitetStatus } from '../../../types';

interface Props {
    status: AktivitetStatus;
    children: ReactNode;
}

interface DragItem {
    aktivitet: Aktivitet;
    type: string;
}

export const DROP_TYPE = 'AktivitetsKort';

function DropTargetKolonne({ status, children }: Props) {
    const dispatch = useDispatch();
    const history = useHistory();

    const [collectedProps, drop] = useDrop({
        accept: DROP_TYPE,
        canDrop: ({ aktivitet }: DragItem) => status !== aktivitet.status,
        drop: ({ aktivitet }: DragItem) => {
            flyttetAktivitetMetrikk('dragAndDrop', aktivitet, status);
            if (status === STATUS_FULLFOERT) {
                history.push(fullforAktivitetRoute(aktivitet.id));
            } else if (status === STATUS_AVBRUTT) {
                history.push(avbrytAktivitetRoute(aktivitet.id));
            } else {
                dispatch(flyttAktivitet(aktivitet, status));
            }
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} className="aktivitetstavle__kolonne-wrapper">
            <div
                className={classNames(
                    'aktivitetstavle__kolonne',
                    collectedProps.canDrop && collectedProps.isOver && 'aktivitetstavle__kolonne--drag'
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default DropTargetKolonne;
