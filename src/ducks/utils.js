import { fetchInterceptor } from '~config'; // eslint-disable-line

/* eslint-env browser */
export const STATUS = {
    NOT_STARTED: 'NOT_STARTED',
    PENDING: 'PENDING',
    OK: 'OK',
    RELOADING: 'RELOADING',
    ERROR: 'ERROR'
};

const DEFAULT_CONFIG = {
    credentials: 'same-origin',
    redirect: 'manual' // ikke bli lurt av at backenden plutseling redirecter til login- eller feilside
};

export function sjekkStatuskode(response) {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    const error = new Error(response.statusText || response.type);
    error.response = response;
    throw error;
}

export function toJson(response) {
    if (response.status !== 204) { // No content
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

export function handterFeil(dispatch, action) {
    return (error) => {
        if (error.response) {
            error.response.text().then((data) => {
                console.error(error, error.stack, data); // eslint-disable-line no-console
                dispatch({ type: action, data: { response: error.response, data } });
            });
        } else {
            console.error(error, error.stack); // eslint-disable-line no-console
            dispatch({ type: action, data: error.toString() });
        }
    };
}

export const getCookie = (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

export function fetchToJson(url, config = {}) {
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };
    return (fetchInterceptor ? fetchInterceptor(fetch, url, configMedCredentials) : fetch(url, configMedCredentials))
        .then(sjekkStatuskode)
        .then(toJson);
}

function methodToJson(method, url, data, config) {
    return fetchToJson(url, {
        ...{
            method,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        },
        ...config
    });
}

export function postAsJson(url, data = {}, config = {}) {
    return methodToJson('post', url, data, config);
}

export function putAsJson(url, data = {}, config = {}) {
    return methodToJson('put', url, data, config);
}

export function doThenDispatch(fn, { OK, FEILET, PENDING }) {
    return (dispatch) => {
        if (PENDING) {
            dispatch({ type: PENDING });
        }
        return fn()
            .then(sendResultatTilDispatch(dispatch, OK))
            .catch(handterFeil(dispatch, FEILET));
    };
}
