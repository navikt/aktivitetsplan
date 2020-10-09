import React from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import Aktivitetskort from './Aktivitetskort';
import { Aktivitet } from '../../../types';
import { DROP_TYPE } from '../../../hovedside/tavle/kolonne/DropTargetKolonne';
import styles from './Aktivitetskort.module.less';
import { startDragging, stopDragging } from './dragAndDropReducer';

interface Props {
    aktivitet: Aktivitet;
}

function DragbartAktivitetskort(props: Props) {
    const { aktivitet } = props;
    const dispatch = useDispatch();

    const [collectedProps, drag] = useDrag({
        item: { aktivitet, type: DROP_TYPE },
        begin: () => {
            dispatch(startDragging(aktivitet));
            return { aktivitet, type: DROP_TYPE };
        },
        end: () => dispatch(stopDragging()),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const className = classNames(collectedProps.isDragging && styles.drag, styles.flyttbar);

    return (
        <div ref={drag}>
            <Aktivitetskort aktivitet={aktivitet} className={className} />
        </div>
    );
}

export default DragbartAktivitetskort;
