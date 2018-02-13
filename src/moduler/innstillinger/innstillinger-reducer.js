import * as OppfolgingApi from '../oppfolging-status/oppfolging-api';
import { doThenDispatch, handterFeil, STATUS } from '../../ducks/utils';
import {
    nyHenvendelse,
    oppdaterFerdigbehandlet,
    oppdaterVenterPaSvar,
} from '../dialog/dialog-reducer';
import {
    hentOppfolging,
    OK as OPPFOLGING_OK,
} from '../oppfolging-status/oppfolging-reducer';
import history from '../../history';

// Actions
export const HENT_OPPFOLGING_OK = 'innstillinger/hent_oppfolging/OK';
export const HENT_OPPFOLGING_FEILET = 'innstillinger/hent_oppfolging/FEILET';
export const HENT_OPPFOLGING_PENDING = 'innstillinger/hent_oppfolging/PENDING';

export const KAN_AVSLUTTE_OK = 'innstillinger/kan_avslutte/OK';
export const KAN_AVSLUTTE_FEILET = 'innstillinger/kan_avslutte/FEILET';
export const KAN_AVSLUTTE_PENDING = 'innstillinger/kan_avslutte/PENDING';

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

export const START_ESKALERING_OK = 'instillinger/start_eskalering/OK';
export const START_ESKALERING_FEILET = 'instillinger/start_eskalering/FEILET';
export const START_ESKALERING_PENDING = 'instillinger/start_eskalering/PENDING';

export const STOPP_ESKALERING_OK = 'instillinger/stopp_eskalering/OK';
export const STOPP_ESKALERING_FEILET = 'instillinger/stopp_eskalering/FEILET';
export const STOPP_ESKALERING_PENDING = 'instillinger/stopp_eskalering/PENDING';

export const LAGRE_BEGRUNNELSE = 'form/lagre_begrunnelse';
export const SLETT_BEGRUNNELSE = 'form/slett_begrunnelse';

export const START_KVP_OK = 'innstillinger/start_kvp/OK';
export const START_KVP_FEILET = 'innstillinger/start_kvp/FEILET';
export const START_KVP_PENDING = 'innstillinger/start_kvp/PENDING';

export const STOPP_KVP_OK = 'innstillinger/stopp_kvp/OK';
export const STOPP_KVP_FEILET = 'innstillinger/stopp_kvp/FEILET';
export const STOPP_KVP_PENDING = 'innstillinger/stopp_kvp/PENDING';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED,
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENT_OPPFOLGING_OK:
        case KAN_AVSLUTTE_OK:
        case AVSLUTT_OPPFOLGING_OK:
        case START_OPPFOLGING_OK:
        case SETT_MANUELL_OK:
        case SETT_DIGITAL_OK:
        case START_ESKALERING_OK:
        case STOPP_ESKALERING_OK:
        case START_KVP_OK:
        case STOPP_KVP_OK:
            return {
                ...state,
                status: STATUS.OK,
                data: action.data,
            };
        case HENT_OPPFOLGING_FEILET:
        case KAN_AVSLUTTE_FEILET:
        case AVSLUTT_OPPFOLGING_FEILET:
        case START_OPPFOLGING_FEILET:
        case SETT_MANUELL_FEILET:
        case SETT_DIGITAL_FEILET:
        case START_ESKALERING_FEILET:
        case STOPP_ESKALERING_FEILET:
        case START_KVP_FEILET:
        case STOPP_KVP_FEILET:
            return {
                ...state,
                status: STATUS.ERROR,
                feil: action.data,
            };
        case HENT_OPPFOLGING_PENDING:
        case KAN_AVSLUTTE_PENDING:
        case AVSLUTT_OPPFOLGING_PENDING:
        case START_OPPFOLGING_PENDING:
        case SETT_MANUELL_PENDING:
        case SETT_DIGITAL_PENDING:
        case START_ESKALERING_PENDING:
        case STOPP_ESKALERING_PENDING:
        case START_KVP_PENDING:
        case STOPP_KVP_PENDING:
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
            return {
                ...state,
                begrunnelse: null,
            };
        default:
            return state;
    }
}

// Action creator
export function hentOppfolgingData() {
    return doThenDispatch(() => OppfolgingApi.hentOppfolging(), {
        OK: HENT_OPPFOLGING_OK,
        FEILET: HENT_OPPFOLGING_FEILET,
        PENDING: HENT_OPPFOLGING_PENDING,
    });
}

export function startOppfolging() {
    return doThenDispatch(() => OppfolgingApi.startOppfolging(), {
        OK: START_OPPFOLGING_OK,
        FEILET: START_OPPFOLGING_FEILET,
        PENDING: START_OPPFOLGING_PENDING,
    });
}

export function kanAvslutteOppfolging() {
    return doThenDispatch(() => OppfolgingApi.kanAvslutte(), {
        OK: KAN_AVSLUTTE_OK,
        FEILET: KAN_AVSLUTTE_FEILET,
        PENDING: KAN_AVSLUTTE_PENDING,
    });
}

export function avsluttOppfolging(begrunnelse, veilederId) {
    return dispatch => {
        dispatch({ type: AVSLUTT_OPPFOLGING_PENDING });
        return OppfolgingApi.avsluttOppfolging(
            begrunnelse,
            veilederId
        ).then(data => {
            dispatch({ type: AVSLUTT_OPPFOLGING_OK, data });
            dispatch({ type: OPPFOLGING_OK, data });
            return data;
        }, handterFeil(dispatch, AVSLUTT_OPPFOLGING_FEILET));
    };
}

export function settManuellOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => OppfolgingApi.settManuellOppfolging(begrunnelse, veilederId),
        {
            OK: SETT_MANUELL_OK,
            FEILET: SETT_MANUELL_FEILET,
            PENDING: SETT_MANUELL_PENDING,
        }
    );
}

export function settDigitalOppfolging(begrunnelse, veilederId) {
    return doThenDispatch(
        () => OppfolgingApi.settDigitalOppfolging(begrunnelse, veilederId),
        {
            OK: SETT_DIGITAL_OK,
            FEILET: SETT_DIGITAL_FEILET,
            PENDING: SETT_DIGITAL_PENDING,
        }
    );
}

function startEskaleringMedDialog(dialogId, begrunnelse) {
    return doThenDispatch(
        () => OppfolgingApi.startEskalering(dialogId, begrunnelse),
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
            .then(() => dispatch(hentOppfolging()))
            .then(() =>
                history.push('/innstillinger/startEskalering/kvittering')
            )
            .catch(() => history.push('/innstillinger/feilkvittering'));
}

function stoppEskaleringProsess(begrunnelse) {
    return doThenDispatch(() => OppfolgingApi.stoppEskalering(begrunnelse), {
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
            .then(() => dispatch(stoppEskaleringProsess(begrunnelse)))
            .then(() => dispatch(hentOppfolging()))
            .then(() =>
                history.push('/innstillinger/stoppEskalering/kvittering')
            )
            .catch(() => history.push('/innstillinger/feilkvittering'));
}

export function stoppEskaleringUtenHenvendelse() {
    return dispatch =>
        dispatch(stoppEskaleringProsess())
            .then(() => dispatch(hentOppfolging()))
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

export const SLETT_BEGRUNNELSE_ACTION = { type: SLETT_BEGRUNNELSE };

export function startKvpOppfolging(begrunnelse) {
    return doThenDispatch(() => OppfolgingApi.startKvpOppfolging(begrunnelse), {
        OK: START_KVP_OK,
        FEILET: START_KVP_FEILET,
        PENDING: START_KVP_PENDING,
    });
}

export function stoppKvpOppfolging(begrunnelse) {
    return doThenDispatch(() => OppfolgingApi.stoppKvpOppfolging(begrunnelse), {
        OK: STOPP_KVP_OK,
        FEILET: STOPP_KVP_FEILET,
        PENDING: STOPP_KVP_PENDING,
    });
}
