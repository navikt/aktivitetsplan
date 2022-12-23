// Actions
export const SETT_VIST_AKTIVITET = 'aktivitetsview/sett-vist-aktivitet';

const initalState = [];

// Reducer
export default function reducer(state = initalState, action) {
    const aktivitet = action.data;
    switch (action.type) {
        case SETT_VIST_AKTIVITET:
            return [...state, aktivitet];
        default:
            return state;
    }
}

// Action creator
export function settAktivitetSomVist(aktivitet) {
    return {
        type: SETT_VIST_AKTIVITET,
        data: aktivitet,
    };
}

export function selectAktiviteterSomHarBlittVist(state) {
    return state.view.visteAktiviteterMedEndringer;
}

export const selectSistVisteAktivitet = (state) => state?.view?.visteAktiviteterMedEndringer?.reduce((a, b) => b, null);
