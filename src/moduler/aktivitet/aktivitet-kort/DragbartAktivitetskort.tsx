import classNames from 'classnames';
import React from 'react';
import { KeyboardSensor, PointerSensor } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { SortableKeyboardPlugin } from '@dnd-kit/dom/sortable';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import Aktivitetskort, { prefixAktivtetskortId } from './Aktivitetskort';
import styles from './Aktivitetskort.module.less';
import { AktivitetskortDragData, DROP_TYPE_AKTIVITETSKORT } from './dragAndDropSlice';
import type { TavleAktivitet } from '../../../hovedside/tavle/Aktivitetskolonner';

interface Props {
    aktivitet: TavleAktivitet;
    group: AktivitetStatus;
    index: number;
}

const sensors = [
    PointerSensor,
    KeyboardSensor.configure({
        // Enter opens the activity link; Space starts keyboard dragging.
        preventActivation: (event, source) => event.key === 'Enter' || event.target !== source.element,
    }),
];
const plugins = [SortableKeyboardPlugin];

function DragbartAktivitetskort(props: Props) {
    const { aktivitet, group, index } = props;

    const { ref, isDragSource } = useSortable<AktivitetskortDragData>({
        id: prefixAktivtetskortId(aktivitet),
        group,
        index,
        type: DROP_TYPE_AKTIVITETSKORT,
        accept: DROP_TYPE_AKTIVITETSKORT,
        data: { aktivitet },
        sensors,
        // React state controls placement; keep measurement and animation without optimistic DOM sorting.
        plugins,
        disabled: { draggable: !!aktivitet.pendingStatus },
        transition: { idle: true },
    });

    const className = classNames(isDragSource && styles.drag, styles.flyttbar, isDragSource && 'opacity-30');

    return <Aktivitetskort ref={ref} aktivitet={aktivitet} className={className} />;
}

export default DragbartAktivitetskort;
