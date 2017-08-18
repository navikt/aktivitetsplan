import { SKJUL_VERSJONSKONFLIKT } from './endre-aktivitet';

// Actions
export const SKJUL_SISTE_FEIL = 'feil/skjul-siste-feil';
export const SKJUL_SISTE_FEIL_ACTION = { type: SKJUL_SISTE_FEIL };

const initalState = {
    sisteFeil: null,
    sisteFeilSkjult: false,
};

const VERSJONSKONFLIKT = 'VERSJONSKONFLIKT';

export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case SKJUL_SISTE_FEIL:
        case SKJUL_VERSJONSKONFLIKT:
            return { ...state, sisteFeilSkjult: true };
        default:
            if (data && data.type === VERSJONSKONFLIKT) {
                return { ...state, sisteFeil: data, sisteFeilSkjult: false };
            }
            return state;
    }
}
