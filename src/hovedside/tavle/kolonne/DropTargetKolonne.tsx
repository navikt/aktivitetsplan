import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../constant';
import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import { flyttetAktivitetMetrikk } from '../../../felles-komponenter/utils/logging';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { selectErBruker } from '../../../moduler/identitet/identitet-selector';
import { selectErUnderOppfolging } from '../../../moduler/oppfolging-status/oppfolging-selector';
import { avbrytAktivitetRoute, fullforAktivitetRoute } from '../../../routes';
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
    const history = useHistory();

    const erBruker = useSelector(selectErBruker, shallowEqual);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);

    const [collectedProps, drop] = useDrop({
        accept: DROP_TYPE,
        canDrop: ({ aktivitet }: DragItem<AlleAktiviteter>) =>
            status !== aktivitet.status && erDroppbar(aktivitet, erBruker, erUnderOppfolging),
        drop: ({ aktivitet }: DragItem<VeilarbAktivitet>) => {
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
