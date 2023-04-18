import { hentFnrFraUrl } from '../utils/fnr-util';

/* eslint-env browser */

const DEFAULT_CONFIG: Partial<RequestInit> = {
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

// https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-errors
export interface SerializedError {
    name?: string;
    message?: string;
    stack?: string;
    code?: string;
    type: string;
}

export async function sjekkStatuskode(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    const error: Omit<SerializedError, 'type'> = {
        code: response.status.toString(),
        message: `${response.url}`,
        name: `${response.statusText} (${response.status})`,
    };
    return Promise.reject(error);
}

export function toJson(response: Response) {
    if (response.status !== 204) {
        // No content
        return response.json();
    }
    return response;
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

export function fetchToJsonPlain(url: string, config = { headers: defaultHeaders }) {
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };
    return fetch(url, configMedCredentials).then(sjekkStatuskode).then(toJson);
}

export function fetchToJson(url: string, config = { headers: defaultHeaders }) {
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

export function postAsJson(url: string, data = {}, config = {}) {
    return methodToJson('post', url, data, config);
}

export function putAsJson(url: string, data = {}, config = {}) {
    return methodToJson('put', url, data, config);
}
