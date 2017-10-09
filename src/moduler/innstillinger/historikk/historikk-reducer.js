import * as Api from './historikk-api';
import { STATUS, doThenDispatch } from '../../../ducks/utils';

// Actions
export const HENT_HISTORIKK_OK = 'historikk/hent_historikk/OK';
export const HENT_HISTORIKK_FEILET = 'historikk/hent_historikk/FEILET';
export const HENT_HISTORIKK_PENDING = 'historikk/hent_historikk/PENDING';

// Actions
export const HENT_OPPGAVEHISTORIKK_OK = 'historikk/hent_oppgavehistorikk/OK';
export const HENT_OPPGAVEHISTORIKK_FEILET = 'historikk/hent_oppgavehistorikk/FEILET';
export const HENT_OPPGAVEHISTORIKK_PENDING = 'historikk/hent_oppgavehistorikk/PENDING';

const initalState = {
    situasjon: {
        status: STATUS.NOT_STARTED,
        data: {},
    },
    oppgave: {
        status: STATUS.NOT_STARTED,
        data: {},
    },
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_HISTORIKK_OK:
            return {
                ...state,
                situasjon: {
                    status: STATUS.OK,
                    data: action.data,
                },
            };
        case HENT_HISTORIKK_FEILET:
            return {
                ...state,
                situasjon: {
                    status: STATUS.ERROR,
                    feil: action.data,
                },
            };
        case HENT_HISTORIKK_PENDING:
            return {
                ...state,
                situasjon: {
                    ...state.situasjon,
                    status:
                        state.situasjon.status === STATUS.NOT_STARTED
                            ? STATUS.PENDING
                            : STATUS.RELOADING,
                },

            };
        case HENT_OPPGAVEHISTORIKK_OK:
            return {
                ...state,
                oppgave: {
                    status: STATUS.OK,
                    data: action.data,
                },
            };
        case HENT_OPPGAVEHISTORIKK_FEILET:
            return {
                ...state,
                oppgave: {
                    status: STATUS.ERROR,
                    feil: action.data,
                },
            };
        case HENT_OPPGAVEHISTORIKK_PENDING:
            return {
                ...state,
                oppgave: {
                    ...state.oppgave,
                    status:
                        state.oppgave.status === STATUS.NOT_STARTED
                            ? STATUS.PENDING
                            : STATUS.RELOADING,
                },

            };
        default:
            return state;
    }
}

// Action Creators
export function hentInnstillingHistorikk() {
    return doThenDispatch(() => Api.hentInnstillingHistorikk(), {
        OK: HENT_HISTORIKK_OK,
        FEILET: HENT_HISTORIKK_FEILET,
        PENDING: HENT_HISTORIKK_PENDING,
    });
}

// Action Creators
export function hentInnstillingOppgavehistorikk() {
    return doThenDispatch(() => Api.hentInnstillingOppgavehistorikk(), {
        OK: HENT_OPPGAVEHISTORIKK_OK,
        FEILET: HENT_OPPGAVEHISTORIKK_FEILET,
        PENDING: HENT_OPPGAVEHISTORIKK_PENDING,
    });
}
