import { update as resetTimeout } from '../felles-komponenter/timeoutbox/timeoutbox';
import { getFodselsnummer } from '../bootstrap/fnr-util';

/* eslint-env browser */
export const STATUS = {
    NOT_STARTED: 'NOT_STARTED',
    PENDING: 'PENDING',
    OK: 'OK',
    RELOADING: 'RELOADING',
    ERROR: 'ERROR',
};

export const FEILTYPE = {
    VERSJONSKONFLIKT: 'VERSJONSKONFLIKT',
    UKJENT: 'UKJENT',
};

const DEFAULT_CONFIG = {
    credentials: 'same-origin',
    redirect: 'manual', // ikke bli lurt av at backenden plutseling redirecter til login- eller feilside
};

const statusPrioritet = {
    ERROR: 5,
    NOT_STARTED: 4,
    PENDING: 3,
    RELOADING: 2,
    OK: 1,
};

export function aggregerStatus(...reducereEllerStatuser) {
    return reducereEllerStatuser.reduce((a, b) => {
        const aStatus = a && (a.status || a);
        const bStatus = b && (b.status || b);
        return (statusPrioritet[aStatus] || 0) > (statusPrioritet[bStatus] || 0)
            ? aStatus
            : bStatus;
    });
}

export function sjekkStatuskode(response) {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    const error = new Error(response.statusText || response.type);
    error.response = response;
    throw error;
}

export function toJson(response) {
    if (response.status !== 204) {
        // No content
        return response.json();
    }
    return response;
}

export function sendResultatTilDispatch(dispatch, action) {
    return (...data) => {
        if (data.length === 1) {
            return dispatch({ type: action, data: data[0] });
        }
        return dispatch({ type: action, data });
    };
}

function parseError(errorData) {
    try {
        return JSON.parse(errorData);
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
        return errorData;
    }
}

export function handterFeil(dispatch, action) {
    return error => {
        const response = error.response;
        if (response) {
            response.text().then(data => {
                console.error(error, error.stack, data); // eslint-disable-line no-console
                dispatch({ type: action, data: parseError(data) });
            });
        } else {
            console.error(error, error.stack); // eslint-disable-line no-console
            dispatch({ type: action, data: error.toString() });
        }
        return Promise.reject(error);
    };
}

export const getCookie = name => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

export function fetchToJson(url, config = {}) {
    resetTimeout();
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };

    const fodselsnummer = getFodselsnummer();
    let fetchUrl = url;
    if (fodselsnummer) {
        fetchUrl = `${url}${url.indexOf('?') >= 0
            ? '&'
            : '?'}fnr=${fodselsnummer}`;
    }

    return fetch(fetchUrl, configMedCredentials)
        .then(sjekkStatuskode)
        .then(toJson);
}

function methodToJson(method, url, data, config) {
    return fetchToJson(url, {
        ...{
            method,
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data),
        },
        ...config,
    });
}

export function postAsJson(url, data = {}, config = {}) {
    return methodToJson('post', url, data, config);
}

export function putAsJson(url, data = {}, config = {}) {
    return methodToJson('put', url, data, config);
}

export function doThenDispatch(fn, { OK, FEILET, PENDING }) {
    return dispatch => {
        if (PENDING) {
            dispatch({ type: PENDING });
        }
        return fn()
            .then(sendResultatTilDispatch(dispatch, OK))
            .catch(handterFeil(dispatch, FEILET));
    };
}
