import React, { ReactNode } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';
import { useHistory } from 'react-router-dom';
import {
    GRUPPE_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../constant';
import { flyttAktivitet } from '../../../moduler/aktivitet/aktivitet-actions';
import { flyttetAktivitetMetrikk } from '../../../felles-komponenter/utils/logging';
import { avbrytAktivitetRoute, fullforAktivitetRoute } from '../../../routes';
import { selectErBruker } from '../../../moduler/identitet/identitet-selector';
import { Aktivitet, AktivitetStatus } from '../../../types';

function sjekkErFlyttbar(aktivitet: Aktivitet, erBruker: boolean) {
    const { type, status, nesteStatus, historisk } = aktivitet;
    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const erFerdig = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const brukerKanOppdater = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return !nesteStatus && !historisk && !erFerdig && !erArenaAktivitet && !brukerKanOppdater;
}

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
    const erBruker = useSelector(selectErBruker, shallowEqual);

    const [collectedProps, drop] = useDrop({
        accept: DROP_TYPE,
        canDrop: ({ aktivitet }: DragItem) => status !== aktivitet.status && sjekkErFlyttbar(aktivitet, erBruker),
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

DropTargetKolonne.propTypes = {
    status: PT.string.isRequired,
    children: PT.node,
};

export default DropTargetKolonne;
