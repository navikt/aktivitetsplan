import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import * as AppPT from '../../../proptypes';
import {
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    SAMTALEREFERAT_TYPE,
    MOTE_TYPE,
} from '../../../constant';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';

import Aktivitetskort from './Aktivitetskort';

function DragbartAktivitetskort(props) {
    const { aktivitet } = props;
    const { id } = aktivitet;

    const erBruker = useSelector(selectErBruker, shallowEqual);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);

    const erFlyttbar = sjekkErFlyttbar(aktivitet, erBruker) && erUnderOppfolging;

    const [collectedProps, drag] = useDrag({
        item: { id, type: 'AktivitetsKort' },
        begin: () => aktivitet,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const className = erFlyttbar && collectedProps.isDragging && 'aktivitetskort--drag';

    return (
        <div ref={drag}>
            <Aktivitetskort aktivitet={aktivitet} className={className} />
        </div>
    );
}

function sjekkErFlyttbar(aktivitet, erBruker) {
    const { type, status, nesteStatus, historisk } = aktivitet;
    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const erFerdig = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const brukerKanOppdater = [SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker;
    return !nesteStatus && !historisk && !erFerdig && !erArenaAktivitet && !brukerKanOppdater;
}

DragbartAktivitetskort.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default DragbartAktivitetskort;
