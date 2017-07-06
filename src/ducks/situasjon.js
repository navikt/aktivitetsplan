import * as Api from './situasjon-api';
import { STATUS, doThenDispatch } from './utils';

// Actions
export const OK = 'situasjon/OK';
export const FEILET = 'situasjon/FEILET';
export const PENDING = 'situasjon/PENDING';

export const AVSLA_OK = 'situasjon/avsla/OK';
export const AVSLA_FEILET = 'situasjon/avsla/FEILET';
export const AVSLA_PENDING = 'situasjon/avsla/PENDING';

export const GODTA_OK = 'situasjon/godta/OK';
export const GODTA_FEILET = 'situasjon/godta/FEILET';
export const GODTA_PENDING = 'situasjon/godta/PENDING';

export const KAN_AVSLUTTE_OK = 'situasjon/kan-avslutte/OK';
export const KAN_AVSLUTTE_FEILET = 'situasjon/kan-avslutte/FEILET';
export const KAN_AVSLUTTE_PENDING = 'situasjon/kan-avslutte/PENDING';

export const AVSLUTT_OPPFOLGING_OK = 'situasjon/avslutt/OK';
export const AVSLUTT_OPPFOLGING_FEILET = 'situasjon/avslutt/FEILET';
export const AVSLUTT_OPPFOLGING_PENDING = 'situasjon/avslutt/PENDING';

export const START_OPPFOLGING_OK = 'situasjon/start/OK';
export const START_OPPFOLGING_FEILET = 'situasjon/start/FEILET';
export const START_OPPFOLGING_PENDING = 'situasjon/start/PENDING';

export const SETT_MANUELL_OK = 'situasjon/manuell/OK';
export const SETT_MANUELL_FEILET = 'situasjon/manuell/FEILET';
export const SETT_MANUELL_PENDING = 'situasjon/manuell/PENDING';

export const SETT_DIGITAL_OK = 'situasjon/digital/OK';
export const SETT_DIGITAL_FEILET = 'situasjon/digital/FEILET';
export const SETT_DIGITAL_PENDING = 'situasjon/digital/PENDING';

export const LAGRE_BEGRUNNELSE = 'form/lagre-begrunnelse';
export const SLETT_BEGRUNNELSE = 'form/slett-begrunnelse';

export const SLETT_BEGRUNNELSE_ACTION = { type: SLETT_BEGRUNNELSE };

const initalState = {
    status: STATUS.NOT_STARTED,
    brukerHarAvslatt: false,
    data: {},
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case OK:
        case KAN_AVSLUTTE_OK:
        case AVSLUTT_OPPFOLGING_OK:
        case START_OPPFOLGING_OK:
        case SETT_MANUELL_OK:
        case SETT_DIGITAL_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case GODTA_OK:
            return {
                ...state,
                status: STATUS.OK,
                brukerHarAvslatt: false,
                data: action.data,
            };
        case AVSLA_OK:
            return {
                ...state,
                status: STATUS.OK,
                brukerHarAvslatt: true,
                data: action.data,
            };
        case FEILET:
        case GODTA_FEILET:
        case AVSLA_FEILET:
        case KAN_AVSLUTTE_FEILET:
        case AVSLUTT_OPPFOLGING_FEILET:
        case START_OPPFOLGING_FEILET:
        case SETT_MANUELL_FEILET:
        case SETT_DIGITAL_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                data: action.data,
            };
        case PENDING:
        case GODTA_PENDING:
        case AVSLA_PENDING:
        case KAN_AVSLUTTE_PENDING:
        case AVSLUTT_OPPFOLGING_PENDING:
        case START_OPPFOLGING_PENDING:
        case SETT_MANUELL_PENDING:
        case SETT_DIGITAL_PENDING:
            return {
                ...state,
                status:
                    state.status === STATUS.NOT_STARTED
                        ? STATUS.PENDING
                        : STATUS.RELOADING,
            };
        case LAGRE_BEGRUNNELSE:
            return {
                ...state,
                begrunnelse: action.data,
            };
        case SLETT_BEGRUNNELSE:
            return { ...state, begrunnelse: null };
        default:
            return state;
    }
}

// Action Creators - NB! Denne brukes av aktivitetsplan
export function hentSituasjon() {
    return doThenDispatch(() => Api.hentSituasjon(), {
        OK,
        FEILET,
        PENDING,
    });
}

// Action Creators - NB! Denne brukes av aktivitetsplan
export function godtaVilkar(hash) {
    return doThenDispatch(() => Api.godtaVilkar(hash), {
        OK: GODTA_OK,
        FEILET: GODTA_FEILET,
        PENDING: GODTA_PENDING,
    });
}

// Action Creators - NB! Denne brukes av aktivitetsplan
export function avslaVilkar(hash) {
    return doThenDispatch(() => Api.avslaaVilkar(hash), {
        OK: AVSLA_OK,
        FEILET: AVSLA_FEILET,
        PENDING: AVSLA_PENDING,
    });
}

export function startOppfolging() {
    return doThenDispatch(() => Api.startOppfolgin1g(), {
        OK: START_OPPFOLGING_OK,
        FEILET: START_OPPFOLGING_FEILET,
        PENDING: START_OPPFOLGING_PENDING,
    });
}

export function kanAvslutteOppfolging() {
    return doThenDispatch(() => Api.kanAvslutte(), {
        OK: KAN_AVSLUTTE_OK,
        FEILET: KAN_AVSLUTTE_FEILET,
        PENDING: KAN_AVSLUTTE_PENDING,
    });
}

export function avsluttOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => Api.avsluttOppfolging(begrunnelse, veilederId),
        {
            OK: AVSLUTT_OPPFOLGING_OK,
            FEILET: AVSLUTT_OPPFOLGING_FEILET,
            PENDING: AVSLUTT_OPPFOLGING_PENDING,
        }
    );
}

export function settManuellOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => Api.settManuellOppfolging(begrunnelse, veilederId),
        {
            OK: SETT_MANUELL_OK,
            FEILET: SETT_MANUELL_FEILET,
            PENDING: SETT_MANUELL_PENDING,
        }
    );
}

export function settDigitalOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => Api.settDigitalOppfolging(begrunnelse, veilederId),
        {
            OK: SETT_DIGITAL_OK,
            FEILET: SETT_DIGITAL_FEILET,
            PENDING: SETT_DIGITAL_PENDING,
        }
    );
}

export function lagreBegrunnelse(begrunnelse) {
    return {
        type: LAGRE_BEGRUNNELSE,
        data: begrunnelse,
    };
}
