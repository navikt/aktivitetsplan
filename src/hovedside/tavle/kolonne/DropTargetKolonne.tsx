import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useDroppable, useDragOperation } from '@dnd-kit/react';
import { useSelector } from 'react-redux';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import {
    AktivitetskortDragData,
    DROP_TYPE_AKTIVITETSKORT,
} from '../../../moduler/aktivitet/aktivitet-kort/dragAndDropSlice';
import { aktivitetDropTargetStatus, erDroppbar } from '../tavleUtils';
import { ReadWriteMode, selectReadWriteMode } from '../../../utils/readOrWriteModeSlice';
import { useErVeileder } from '../../../Provider';

interface Props {
    status: AktivitetStatus;
    children: ReactNode;
}

function DropTargetKolonne({ status, children }: Props) {
    const erVeileder = useErVeileder();
    const readOnly = useSelector(selectReadWriteMode) == ReadWriteMode.READ;
    const operation = useDragOperation<AktivitetskortDragData>();
    const draggingAktivitet =
        operation.source?.type === DROP_TYPE_AKTIVITETSKORT ? operation.source.data.aktivitet : undefined;

    const canDrop = (aktivitet: AlleAktiviteter) =>
        status !== aktivitet.status && erDroppbar(aktivitet, !erVeileder, readOnly);

    const { ref: dropRef } = useDroppable({
        id: `aktivitetskolonne-${status}`,
        accept: DROP_TYPE_AKTIVITETSKORT,
        disabled: !draggingAktivitet || !erDroppbar(draggingAktivitet, !erVeileder, readOnly),
    });

    const isDragging = !!draggingAktivitet;
    const isOverAndCanDrop =
        aktivitetDropTargetStatus(operation) === status && !!draggingAktivitet && canDrop(draggingAktivitet);

    return (
        <div ref={dropRef} className="z-50 h-full">
            <div
                className={classNames(
                    'bg-ax-bg-neutral-soft border-t border-ax-border-neutral-subtle rounded-none p-4 sm:p-4 lg:p-2 m-0 sm:border-t-0 sm:rounded-md aktivitetstavle__kolonne',
                    {
                        'opacity-50': isDragging && !isOverAndCanDrop,
                        'bg-ax-bg-accent-moderate-hover ': isOverAndCanDrop,
                    },
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default DropTargetKolonne;
