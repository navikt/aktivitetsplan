import { FEILTYPE } from './utils';
import { OPPDATER_FEILET } from './aktiviteter';

// Actions
export const SKJUL_VERSJONSKONFLIKT = 'endre-aktivitet/skjulVersjonskonflikt';
export const SKJUL_VERSJONSKONFLIKT_ACTION = { type: SKJUL_VERSJONSKONFLIKT };

const initalState = {
    visVersjonskonflikt: false
};

export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case OPPDATER_FEILET:
            return { ...state, visVersjonskonflikt: data.type === FEILTYPE.VERSJONSKONFLIKT };
        case SKJUL_VERSJONSKONFLIKT:
            return { ...state, visVersjonskonflikt: false };
        default:
            return state;
    }
}
