import classNames from 'classnames';
import React from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { DROP_TYPE } from '../../../hovedside/tavle/kolonne/DropTargetKolonne';
import Aktivitetskort from './Aktivitetskort';
import styles from './Aktivitetskort.module.less';
import { startDragging, stopDragging } from './dragAndDropSlice';

interface Props {
    aktivitet: AlleAktiviteter;
}

function DragbartAktivitetskort(props: Props) {
    const { aktivitet } = props;
    const dispatch = useAppDispatch();

    const [collectedProps, drag] = useDrag({
        type: DROP_TYPE,
        item: () => {
            // Trenger dette fordi uten så går det ikke å dra noe bak advarsel-popup
            setTimeout(() => dispatch(startDragging(aktivitet)));
            return { aktivitet, type: DROP_TYPE };
        },
        end: () => dispatch(stopDragging()),
        collect: (monitor: DragSourceMonitor<unknown, unknown>) => ({
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
