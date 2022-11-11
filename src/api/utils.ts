import { AnyAction, Dispatch } from 'redux';

import { ReduxDispatch } from '../felles-komponenter/hooks/useReduxDispatch';
import { hentFnrFraUrl } from '../utils/fnr-util';

/* eslint-env browser */
export const STATUS = {
    NOT_STARTED: 'NOT_STARTED',
    PENDING: 'PENDING',
    OK: 'OK',
    RELOADING: 'RELOADING',
    ERROR: 'ERROR',
};

const DEFAULT_CONFIG: RequestInit = {
    credentials: 'same-origin',
};

enum StatusPrioritet {
    ERROR = 5,
    NOT_STARTED = 4,
    PENDING = 3,
    RELOADING = 2,
    OK = 1,
}

export function aggregerStatus(...reducereEllerStatuser: (StatusPrioritet | { status: StatusPrioritet })[]) {
    // TODO: Make sure this works
    return reducereEllerStatuser.reduce((a, b) => {
        const aStatus = typeof a !== 'number' ? a.status : a;
        const bStatus = typeof b !== 'number' ? b.status : b;
        return (StatusPrioritet[aStatus] || 0) > (StatusPrioritet[bStatus] || 0) ? aStatus : bStatus;
    });
}

export function sjekkStatuskode(response: Response) {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    const error = new Error(response.statusText || response.type);
    // IKKJE BRA!
    (error as any).response = response;
    throw error;
}

export function toJson(response: Response) {
    if (response.status !== 204) {
        // No content
        return response.json();
    }
    return response;
}

export function sendResultatTilDispatch(dispatch: ReduxDispatch, action: AnyAction) {
    return (...data: any[]) => {
        if (data.length === 1) {
            return dispatch({ type: action, data: data[0] });
        }
        return dispatch({ type: action, data });
    };
}

function parseError(errorData: string) {
    try {
        return JSON.parse(errorData);
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
        return errorData;
    }
}

export function handterFeil(dispatch: ReduxDispatch, FEILET_TYPE: string) {
    return (error: { response?: Response; stack: any }) => {
        const { response } = error;
        if (response) {
            response.text().then((data: any) => {
                console.error(error, error.stack, data); // eslint-disable-line no-console
                dispatch({
                    type: FEILET_TYPE,
                    data: {
                        type: FEILET_TYPE,
                        httpStatus: response.status,
                        melding: parseError(data),
                    },
                });
            });
        } else {
            console.error(error, error.stack); // eslint-disable-line no-console
            dispatch({
                type: FEILET_TYPE,
                data: {
                    type: FEILET_TYPE,
                    tekst: error.toString(),
                },
            });
        }
        return Promise.reject(error);
    };
}

export const getCookie = (name: string) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

const defaultHeaders = {
    'Content-Type': 'application/json',
    NAV_CSRF_PROTECTION: getCookie('NAV_CSRF_PROTECTION'), // eslint-disable-line quote-props
    'Nav-Consumer-Id': 'aktivitetsplan',
};

export function fetchToJsonPlain(url: string, config: RequestInit = { headers: defaultHeaders }) {
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };
    return fetch(url, configMedCredentials).then(sjekkStatuskode).then(toJson);
}

export function fetchToJson(url: string, config: RequestInit = { headers: defaultHeaders }) {
    const configMedCredentials: RequestInit = { ...DEFAULT_CONFIG, ...config };

    const fodselsnummer = hentFnrFraUrl();
    let fetchUrl = url;
    if (fodselsnummer) {
        fetchUrl = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}fnr=${fodselsnummer}`;
    }

    return fetch(fetchUrl, configMedCredentials).then(sjekkStatuskode).then(toJson);
}

function methodToJson(method: 'post' | 'get' | 'put' | 'delete', url: string, data: any, config: RequestInit) {
    // prettier-ignore
    return fetchToJson(url, {
        ...{
            method,
            headers: defaultHeaders,
            body: JSON.stringify(data),
        },
        ...config,
    });
}

export function deleteAsJson(url: string, config = {}) {
    return methodToJson('delete', url, null, config);
}

export function postAsJson(url: string, data = {}, config = {}) {
    return methodToJson('post', url, data, config);
}

export function putAsJson(url: string, data = {}, config = {}) {
    return methodToJson('put', url, data, config);
}

export function doThenDispatch(
    fn: () => Promise<any>,
    { OK, FEILET, PENDING }: { OK: string; FEILET: string; PENDING?: string }
) {
    return (dispatch: Dispatch) => {
        if (PENDING) {
            dispatch({ type: PENDING });
        }
        return fn()
            .then(sendResultatTilDispatch(dispatch, OK as unknown as AnyAction))
            .catch(handterFeil(dispatch, FEILET));
    };
}
