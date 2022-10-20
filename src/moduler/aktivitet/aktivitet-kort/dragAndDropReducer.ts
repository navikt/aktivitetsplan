import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';

const START = `DRAG/START`;
const STOP = `DRAG/STOP`;

interface Action {
    type: string;
    aktivitet: AlleAktiviteter;
}

interface State {
    dragging: boolean;
    aktivitet?: AlleAktiviteter;
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

export function startDragging(aktivitet: AlleAktiviteter) {
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
