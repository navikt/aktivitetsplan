import React from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import Aktivitetskort from './Aktivitetskort';
import { Aktivitet } from '../../../types';
import { DROP_TYPE } from '../../../hovedside/tavle/kolonne/DropTargetKolonne';
import {
    GRUPPE_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../constant';
import { shallowEqual, useSelector } from 'react-redux';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';

interface Props {
    aktivitet: Aktivitet;
}

function DragbartAktivitetskort(props: Props) {
    const { aktivitet } = props;

    const erBruker = useSelector(selectErBruker, shallowEqual);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);

    const erFlyttbar = sjekkErFlyttbar(aktivitet, erBruker) && erUnderOppfolging;

    const [collectedProps, drag] = useDrag({
        item: { aktivitet, type: DROP_TYPE },
        canDrag: () => erFlyttbar,
        begin: () => ({ aktivitet, type: DROP_TYPE }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const className = classNames(
        collectedProps.isDragging && 'aktivitetskort--drag',
        erFlyttbar && 'aktivitetskort--flyttbar'
    );

    return (
        <div ref={drag}>
            <Aktivitetskort aktivitet={aktivitet} className={className} />
        </div>
    );
}

function sjekkErFlyttbar(aktivitet: Aktivitet, erBruker: boolean) {
    const { type, status, nesteStatus, historisk } = aktivitet;
    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const erFerdig = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const brukerKanOppdater = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return !nesteStatus && !historisk && !erFerdig && !erArenaAktivitet && !brukerKanOppdater;
}

export default DragbartAktivitetskort;
