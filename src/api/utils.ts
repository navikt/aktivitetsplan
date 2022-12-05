import { AnyAction, Dispatch } from 'redux';

import { ReduxDispatch } from '../felles-komponenter/hooks/useReduxDispatch';
import { hentFnrFraUrl } from '../utils/fnr-util';

/* eslint-env browser */
export const STATUS = {
    NOT_STARTED: 'NOT_STARTED' as const,
    PENDING: 'PENDING' as const,
    OK: 'OK' as const,
    RELOADING: 'RELOADING' as const,
    ERROR: 'ERROR' as const,
};
export type RequestStatus = 'NOT_STARTED' | 'PENDING' | 'OK' | 'RELOADING' | 'ERROR';

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

const getStatusValue = (
    thing: RequestStatus | StatusPrioritet | { status: StatusPrioritet | RequestStatus }
): number => {
    if (thing === null || thing === undefined) return 0;
    if (typeof thing === 'string') return StatusPrioritet[thing];
    if (typeof thing === 'number') return thing;
    if (thing.status) return getStatusValue(thing.status);
    return 0;
};

const getStatusString = (thing: RequestStatus | StatusPrioritet | { status: StatusPrioritet }) => {
    if (!thing || typeof thing === 'string' || typeof thing == 'number') return thing;
    return thing.status ?? thing;
};

export function aggregerStatus(
    ...reducereEllerStatuser: (RequestStatus | StatusPrioritet | { status: StatusPrioritet })[]
) {
    return reducereEllerStatuser.reduce((mostImportantStatus, next) => {
        const aStatusValue = getStatusValue(mostImportantStatus);
        const bStatusValue = getStatusValue(next);
        return aStatusValue > bStatusValue ? mostImportantStatus : getStatusString(next);
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

export function sendResultatTilDispatch(dispatch: ReduxDispatch, actionType: ActionTypeOrCreator) {
    return (...data: any[]) => {
        if (data.length === 1) {
            return dispatch(createAction(actionType, data[0]));
        }
        return dispatch(createAction(actionType, data));
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

export function handterFeil(dispatch: ReduxDispatch, FEILET_TYPE: ActionTypeOrCreator) {
    return (error: { response?: Response; stack: any }) => {
        const { response } = error;
        if (response) {
            response.text().then((data: any) => {
                console.error(error, error.stack, data); // eslint-disable-line no-console
                dispatch(
                    createAction(FEILET_TYPE, {
                        type: FEILET_TYPE,
                        httpStatus: response.status,
                        melding: parseError(data),
                    })
                );
            });
        } else {
            console.error(error, error.stack); // eslint-disable-line no-console
            dispatch(
                createAction(FEILET_TYPE, {
                    type: FEILET_TYPE,
                    tekst: error.toString(),
                })
            );
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

export type ActionTypeOrCreator = string | ((payload: any) => AnyAction);
export const createAction = <T>(typeOrCreator: ActionTypeOrCreator, payload: T | undefined = undefined): AnyAction => {
    // New actionCreators use "payload" field, type relies on "data" field
    if (typeof typeOrCreator === 'string') return { type: typeOrCreator, data: payload };
    return typeOrCreator(payload);
};

export function doThenDispatch(
    fn: () => Promise<any>,
    { OK, FEILET, PENDING }: { OK: ActionTypeOrCreator; FEILET: ActionTypeOrCreator; PENDING?: ActionTypeOrCreator }
) {
    return (dispatch: Dispatch) => {
        if (PENDING) {
            dispatch(createAction(PENDING));
        }
        return fn().then(sendResultatTilDispatch(dispatch, OK)).catch(handterFeil(dispatch, FEILET));
    };
}
