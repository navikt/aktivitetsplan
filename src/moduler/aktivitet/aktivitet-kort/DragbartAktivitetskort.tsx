import React from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import Aktivitetskort from './Aktivitetskort';
import { Aktivitet } from '../../../types';
import { DROP_TYPE } from '../../../hovedside/tavle/kolonne/DropTargetKolonne';

interface Props {
    aktivitet: Aktivitet;
}

function DragbartAktivitetskort(props: Props) {
    const { aktivitet } = props;

    const [collectedProps, drag] = useDrag({
        item: { aktivitet, type: DROP_TYPE },
        begin: () => ({ aktivitet, type: DROP_TYPE }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const className = classNames(collectedProps.isDragging && 'aktivitetskort--drag', 'aktivitetskort--flyttbar');

    return (
        <div ref={drag}>
            <Aktivitetskort aktivitet={aktivitet} className={className} />
        </div>
    );
}

export default DragbartAktivitetskort;
