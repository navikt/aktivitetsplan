import { hentFnrFraUrl } from '../utils/fnr-util';

/* eslint-env browser */
export const STATUS = {
    NOT_STARTED: 'NOT_STARTED',
    PENDING: 'PENDING',
    OK: 'OK',
    RELOADING: 'RELOADING',
    ERROR: 'ERROR',
};

const DEFAULT_CONFIG = {
    credentials: 'same-origin',
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
        return (statusPrioritet[aStatus] || 0) > (statusPrioritet[bStatus] || 0) ? aStatus : bStatus;
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

export function handterFeil(dispatch, FEILET_TYPE) {
    return (error) => {
        const { response } = error;
        if (response) {
            response.text().then((data) => {
                console.error(error, error.stack, data); // eslint-disable-line no-console
                dispatch({
                    type: FEILET_TYPE,
                    data: {
                        type: FEILET_TYPE,
                        httpStatus: response.status,
                        melding: parseError(data),
                    },
                });
                const errorData = JSON.parse(data);

                if (window.frontendlogger) {
                    window.frontendlogger.error({
                        message: [
                            error.stack,
                            `Id: ${errorData.id}`,
                            `Type: ${errorData.type} ${errorData.detaljer ? errorData.detaljer.detaljertType : ''}`,
                            errorData.detaljer ? errorData.detaljer.stackTrace : '',
                        ].join('\n'),
                    });
                }
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

export const getCookie = (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

const defaultHeaders = {
    'Content-Type': 'application/json',
    NAV_CSRF_PROTECTION: getCookie('NAV_CSRF_PROTECTION'), // eslint-disable-line quote-props
    'Nav-Consumer-Id': 'aktivitetsplan',
};

export function fetchToJsonPlain(url, config = { headers: defaultHeaders }) {
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };
    return fetch(url, configMedCredentials).then(sjekkStatuskode).then(toJson);
}

export function fetchToJson(url, config = { headers: defaultHeaders }) {
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };

    const fodselsnummer = hentFnrFraUrl();
    let fetchUrl = url;
    if (fodselsnummer) {
        fetchUrl = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}fnr=${fodselsnummer}`;
    }

    return fetch(fetchUrl, configMedCredentials).then(sjekkStatuskode).then(toJson);
}

function methodToJson(method, url, data, config) {
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

export function deleteAsJson(url, config = {}) {
    return methodToJson('delete', url, null, config);
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
        return fn().then(sendResultatTilDispatch(dispatch, OK)).catch(handterFeil(dispatch, FEILET));
    };
}
