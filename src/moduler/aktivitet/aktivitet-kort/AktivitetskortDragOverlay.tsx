import { DragOverlay, useDragOperation } from '@dnd-kit/react';
import Aktivitetskort from './Aktivitetskort';
import { AktivitetskortDragData, DROP_TYPE_AKTIVITETSKORT } from './dragAndDropSlice';

export default function AktivitetskortDragOverlay() {
    const { source } = useDragOperation<AktivitetskortDragData>();
    return (
        <DragOverlay>
            {source?.type === DROP_TYPE_AKTIVITETSKORT ? (
                <div inert aria-hidden="true">
                    <Aktivitetskort aktivitet={source.data.aktivitet} className="" />
                </div>
            ) : null}
        </DragOverlay>
    );
}
