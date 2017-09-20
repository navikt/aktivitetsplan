import * as SituasjonApi from '../situasjon/situasjon-api';
import * as Api from '../../ducks/api';
import { doThenDispatch, STATUS } from '../../ducks/utils';
import {
    nyHenvendelse,
    oppdaterFerdigbehandlet,
    oppdaterVenterPaSvar,
} from '../../ducks/dialog';
import { hentSituasjon } from '../situasjon/situasjon';
import history from '../../history';

// Actions
export const HENT_SITUASJON_OK = 'innstillinger/hent-situasjon/OK';
export const HENT_SITUASJON_FEILET = 'innstillinger/hent-situasjon/FEILET';
export const HENT_SITUASJON_PENDING = 'innstillinger/hent-situasjon/PENDING';

export const KAN_AVSLUTTE_OK = 'innstillinger/kan-avslutte/OK';
export const KAN_AVSLUTTE_FEILET = 'innstillinger/kan-avslutte/FEILET';
export const KAN_AVSLUTTE_PENDING = 'innstillinger/kan-avslutte/PENDING';

export const AVSLUTT_OPPFOLGING_OK = 'innstillinger/avslutt/OK';
export const AVSLUTT_OPPFOLGING_FEILET = 'innstillinger/avslutt/FEILET';
export const AVSLUTT_OPPFOLGING_PENDING = 'innstillinger/avslutt/PENDING';

export const START_OPPFOLGING_OK = 'innstillinger/start/OK';
export const START_OPPFOLGING_FEILET = 'innstillinger/start/FEILET';
export const START_OPPFOLGING_PENDING = 'innstillinger/start/PENDING';

export const SETT_MANUELL_OK = 'innstillinger/manuell/OK';
export const SETT_MANUELL_FEILET = 'innstillinger/manuell/FEILET';
export const SETT_MANUELL_PENDING = 'innstillinger/manuell/PENDING';

export const SETT_DIGITAL_OK = 'innstillinger/digital/OK';
export const SETT_DIGITAL_FEILET = 'innstillinger/digital/FEILET';
export const SETT_DIGITAL_PENDING = 'innstillinger/digital/PENDING';

export const START_ESKALERING_OK = 'instillinger/start-eskalering/OK';
export const START_ESKALERING_FEILET = 'instillinger/start-eskalering/FEILET';
export const START_ESKALERING_PENDING = 'instillinger/start-eskalering/PENDING';

export const STOPP_ESKALERING_OK = 'instillinger/stopp-eskalering/OK';
export const STOPP_ESKALERING_FEILET = 'instillinger/stopp-eskalering/FEILET';
export const STOPP_ESKALERING_PENDING = 'instillinger/stopp-eskalering/PENDING';

export const LAGRE_BEGRUNNELSE = 'form/lagre-begrunnelse';
export const SLETT_BEGRUNNELSE = 'form/slett-begrunnelse';
export const SLETT_BEGRUNNELSE_ACTION = { type: SLETT_BEGRUNNELSE };

export const HENT_BEHANDLENDE_ENHETER_OK =
    'instillinger/hent-behandlende-enheter/OK';
export const HENT_BEHANDLENDE_ENHETER_FEILET =
    'instillinger/hent-behandlende-enheter/FEILET';
export const HENT_BEHANDLENDE_ENHETER_PENDING =
    'instillinger/hent-behandlende-enheter/PENDING';
export const HENT_BEHANDLENDE_ENHETER_RESET =
    'instillinger/hent-behandlende-enheter/RESET';

export const HENT_VEILEDERE_OK = 'instillinger/hent-veiledere/OK';
export const HENT_VEILEDERE_FEILET = 'instillinger/hent-veiledere/FEILET';
export const HENT_VEILEDERE_PENDING = 'instillinger/hent-veiledere/PENDING';

export const OPPRETT_OPPGAVE_OK = 'instillinger/opprett-oppgave/OK';
export const OPPRETT_OPPGAVE_FEILET = 'instillinger/opprett-oppgave/FEILET';
export const OPPRETT_OPPGAVE_PENDING = 'instillinger/opprett-oppgave/PENDING';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
    behandlendeEnheter: {
        status: STATUS.NOT_STARTED,
    },
    veiledere: {
        status: STATUS.NOT_STARTED,
    },
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_BEHANDLENDE_ENHETER_OK:
            return {
                ...state,
                status: STATUS.OK,
                behandlendeEnheter: {
                    enheter: action.data,
                    status: STATUS.OK,
                },
            };
        case HENT_VEILEDERE_OK:
            return {
                ...state,
                veiledere: {
                    ...action.data,
                    status: STATUS.OK,
                },
            };
        case HENT_SITUASJON_OK:
        case KAN_AVSLUTTE_OK:
        case AVSLUTT_OPPFOLGING_OK:
        case START_OPPFOLGING_OK:
        case SETT_MANUELL_OK:
        case SETT_DIGITAL_OK:
        case START_ESKALERING_OK:
        case STOPP_ESKALERING_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case HENT_BEHANDLENDE_ENHETER_FEILET:
            return {
                ...state,
                behandlendeEnheter: {
                    enheter: action.data,
                    status: STATUS.ERROR,
                },
            };
        case HENT_VEILEDERE_FEILET:
            return {
                ...state,
                veiledere: {
                    ...action.data,
                    status: STATUS.ERROR,
                },
            };
        case HENT_SITUASJON_FEILET:
        case KAN_AVSLUTTE_FEILET:
        case AVSLUTT_OPPFOLGING_FEILET:
        case START_OPPFOLGING_FEILET:
        case SETT_MANUELL_FEILET:
        case SETT_DIGITAL_FEILET:
        case START_ESKALERING_FEILET:
        case STOPP_ESKALERING_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                feil: action.data,
            };
        case HENT_BEHANDLENDE_ENHETER_PENDING:
            return {
                ...state,
                status: STATUS.PENDING,
            };
        case HENT_VEILEDERE_PENDING:
            return {
                ...state,
                veiledere: {
                    status: STATUS.PENDING,
                },
            };
        case HENT_SITUASJON_PENDING:
        case KAN_AVSLUTTE_PENDING:
        case AVSLUTT_OPPFOLGING_PENDING:
        case START_OPPFOLGING_PENDING:
        case SETT_MANUELL_PENDING:
        case SETT_DIGITAL_PENDING:
        case START_ESKALERING_PENDING:
        case STOPP_ESKALERING_PENDING:
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
        case HENT_BEHANDLENDE_ENHETER_RESET:
            return {
                ...state,
                behandlendeEnheter: {
                    status: STATUS.NOT_STARTED,
                },
            };
        default:
            return state;
    }
}

// Action creator
export function hentSituasjonData() {
    return doThenDispatch(() => SituasjonApi.hentSituasjon(), {
        OK: HENT_SITUASJON_OK,
        FEILET: HENT_SITUASJON_FEILET,
        PENDING: HENT_SITUASJON_PENDING,
    });
}

export function startOppfolging() {
    return doThenDispatch(() => SituasjonApi.startOppfolging(), {
        OK: START_OPPFOLGING_OK,
        FEILET: START_OPPFOLGING_FEILET,
        PENDING: START_OPPFOLGING_PENDING,
    });
}

export function kanAvslutteOppfolging() {
    return doThenDispatch(() => SituasjonApi.kanAvslutte(), {
        OK: KAN_AVSLUTTE_OK,
        FEILET: KAN_AVSLUTTE_FEILET,
        PENDING: KAN_AVSLUTTE_PENDING,
    });
}

export function avsluttOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => SituasjonApi.avsluttOppfolging(begrunnelse, veilederId),
        {
            OK: AVSLUTT_OPPFOLGING_OK,
            FEILET: AVSLUTT_OPPFOLGING_FEILET,
            PENDING: AVSLUTT_OPPFOLGING_PENDING,
        }
    );
}

export function settManuellOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => SituasjonApi.settManuellOppfolging(begrunnelse, veilederId),
        {
            OK: SETT_MANUELL_OK,
            FEILET: SETT_MANUELL_FEILET,
            PENDING: SETT_MANUELL_PENDING,
        }
    );
}

export function settDigitalOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => SituasjonApi.settDigitalOppfolging(begrunnelse, veilederId),
        {
            OK: SETT_DIGITAL_OK,
            FEILET: SETT_DIGITAL_FEILET,
            PENDING: SETT_DIGITAL_PENDING,
        }
    );
}

function startEskaleringMedDialog(dialogId, begrunnelse) {
    return doThenDispatch(
        () => SituasjonApi.startEskalering(dialogId, begrunnelse),
        {
            OK: START_ESKALERING_OK,
            FEILET: START_ESKALERING_FEILET,
            PENDING: START_ESKALERING_PENDING,
        }
    );
}

export function startEskalering(eskaleringData) {
    const begrunnelse = eskaleringData.begrunnelse;
    return dispatch =>
        dispatch(
            nyHenvendelse({
                ...eskaleringData,
                tekst: begrunnelse,
                egenskaper: ['ESKALERINGSVARSEL'],
            })
        )
            .then(henvendelse => {
                const dialogId = henvendelse.data.id;
                dispatch(oppdaterVenterPaSvar(dialogId, true));
                dispatch(oppdaterFerdigbehandlet(dialogId, true));
                return dispatch(
                    startEskaleringMedDialog(dialogId, begrunnelse)
                );
            })
            .then(() => dispatch(hentSituasjon()))
            .then(() =>
                history.push('/innstillinger/startEskalering/kvittering')
            )
            .catch(() => history.push('/innstillinger/feilkvittering'));
}

function stoppEskaleringMedBegrunnelse(begrunnelse) {
    return doThenDispatch(() => SituasjonApi.stoppEskalering(begrunnelse), {
        OK: STOPP_ESKALERING_OK,
        FEILET: STOPP_ESKALERING_FEILET,
        PENDING: STOPP_ESKALERING_PENDING,
    });
}

export function stoppEskalering(stoppEskaleringData) {
    const begrunnelse = stoppEskaleringData.begrunnelse;
    return dispatch =>
        dispatch(
            nyHenvendelse({
                ...stoppEskaleringData,
                tekst: begrunnelse,
                egenskaper: ['ESKALERINGSVARSEL'],
            })
        )
            .then(() => dispatch(stoppEskaleringMedBegrunnelse(begrunnelse)))
            .then(() => dispatch(hentSituasjon()))
            .then(() =>
                history.push('/innstillinger/stoppEskalering/kvittering')
            )
            .catch(() => history.push('/innstillinger/feilkvittering'));
}

export function lagreBegrunnelse(begrunnelse) {
    return {
        type: LAGRE_BEGRUNNELSE,
        data: begrunnelse,
    };
}

export function hentBehandlendeEnheter(tema, fnr) {
    return doThenDispatch(() => Api.hentBehandlendeEnheter(tema, fnr), {
        OK: HENT_BEHANDLENDE_ENHETER_OK,
        FEILET: HENT_BEHANDLENDE_ENHETER_FEILET,
        PENDING: HENT_BEHANDLENDE_ENHETER_PENDING,
    });
}

export function hentVeiledereForEnhet(enhetid) {
    return doThenDispatch(() => Api.hentVeieldereForEnhet(enhetid), {
        OK: HENT_VEILEDERE_OK,
        FEILET: HENT_VEILEDERE_FEILET,
        PENDING: HENT_VEILEDERE_PENDING,
    });
}

export function resetEnheter() {
    return {
        type: HENT_BEHANDLENDE_ENHETER_RESET,
    };
}
