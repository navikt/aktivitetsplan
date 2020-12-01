import { Aktivitet } from '../../../types';

const START = `DRAG/START`;
const STOP = `DRAG/STOP`;

interface Action {
    type: string;
    aktivitet: Aktivitet;
}

interface State {
    dragging: boolean;
    aktivitet?: Aktivitet;
}

const initalState: State = {
    dragging: false,
    aktivitet: undefined,
};

export default function dragAndDropReducer(state = initalState, action: Action) {
    switch (action.type) {
        case START:
            return {
                ...state,
                dragging: true,
                aktivitet: action.aktivitet,
            };
        case STOP:
            return {
                ...state,
                dragging: false,
                aktivitet: undefined,
            };
        default:
            return state;
    }
}

export function startDragging(aktivitet: Aktivitet) {
    return { type: START, aktivitet };
}

export function stopDragging() {
    return { type: STOP };
}

function selectDragAndDropSlice(state: any): State {
    return state.view.dragAndDrop;
}

export function selectDraggingAktivitet(state: any) {
    return selectDragAndDropSlice(state).aktivitet;
}
