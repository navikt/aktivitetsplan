import { STATUS } from '../../ducks/utils';

// Actions
export const LAGRER_PRINTMELDING = 'utskrift/lagre-printmelding';
export const REDIGER_PRINTMELDING = 'utskrift/rediger-printmelding';

const initalState = {
    data: {},
    status: STATUS.OK,
};

// Reducer
export default function reducer(state = initalState, action) {
    const data = action.data;
    switch (action.type) {
        case LAGRER_PRINTMELDING:
            return {
                ...state,
                data,
                redigerer: false,
            };
        case REDIGER_PRINTMELDING:
            return {
                ...state,
                redigerer: true,
            };
        default:
            return state;
    }
}

export function lagrePrintMelding(printmelding) {
    return {
        type: LAGRER_PRINTMELDING,
        data: printmelding,
    };
}

export function redigerPrintMelding() {
    return {
        type: REDIGER_PRINTMELDING,
    };
}
