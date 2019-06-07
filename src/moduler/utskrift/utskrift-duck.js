// Actions
export const LAGRER_PRINTMELDING = 'utskrift/lagre-printmelding';
export const GO_TO_STEP = 'utskrift/to-to-step';
export const VELG_PRINT_TYPE = 'utskrift/velg-print-type';
export const RESET_UTSKRIFT = 'utskrift/reset';

const initalState = {
    data: {},
    currentStep: 0,
};

// Reducer
export default function reducer(state = initalState, action) {
    const {data} = action;
    switch (action.type) {
        case LAGRER_PRINTMELDING:
            return {
                ...state,
                data,
                currentStep: state.currentStep + 1,
            };
        case VELG_PRINT_TYPE:
            return {
                ...state,
                data,
                currentStep: state.currentStep + 1,
            };
        case GO_TO_STEP:
            return {
                ...state,
                currentStep: action.step,
            };
        case RESET_UTSKRIFT:
            return initalState;
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

export function velgPrintType(printType) {
    return {
        type: VELG_PRINT_TYPE,
        data: printType,
    };
}

export function goToStepUtskrift(step) {
    return {
        type: GO_TO_STEP,
        step,
    };
}

export function resetUtskrift() {
    return {
        type: RESET_UTSKRIFT,
    };
}
