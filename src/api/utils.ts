import { Status } from '../createGenericSlice';

/* eslint-env browser */

export const DEFAULT_CONFIG: Partial<RequestInit> = {
    credentials: 'same-origin',
};

const statusPrioritet: Record<Status, number> = {
    ERROR: 5,
    NOT_STARTED: 4,
    PENDING: 3,
    RELOADING: 2,
    OK: 1,
};

export function aggregerStatus(...reducereEllerStatuser: Status[]) {
    return reducereEllerStatuser.reduce((a, b) => {
        return statusPrioritet[a] > statusPrioritet[b] ? a : b;
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

const getPath = (response: Response) => {
    try {
        return new URL(response.url).pathname;
    } catch (e) {
        return response.url;
    }
};

// Custom HTTP Error class for better Sentry grouping and reporting
export class HttpError extends Error {
    public readonly code: string;
    public readonly url: string;
    public readonly method: string;
    public readonly operation?: string;
    public readonly endpoint: string;

    constructor(response: Response, operation?: string) {
        const endpoint = getPath(response);
        const message = `HTTP ${response.status}: ${response.statusText} - ${operation || endpoint}`;
        super(message);

        this.name = 'HttpError';
        this.code = response.status.toString();
        this.url = response.url;
        this.method = response.type || 'unknown';
        this.operation = operation;
        this.endpoint = endpoint;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, HttpError);
        }
    }
}

export async function sjekkStatuskode(response: Response, operation?: string): Promise<Response> {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    throw new HttpError(response, operation);
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

export function fetchToJsonPlain(url: string, config = { headers: defaultHeaders }, operation?: string) {
    const configMedCredentials = { ...DEFAULT_CONFIG, ...config };
    return fetch(url, configMedCredentials)
        .then((response) => sjekkStatuskode(response, operation))
        .then(toJson);
}

export function fetchToJson(
    url: string,
    config: RequestInit = { headers: defaultHeaders, method: 'get' },
    operation?: string,
) {
    const configMedCredentials = {
        ...DEFAULT_CONFIG,
        ...config,
    };

    return fetch(url, configMedCredentials)
        .then((response) => sjekkStatuskode(response, operation))
        .then(toJson);
}

type HttpMethod = 'post' | 'put' | 'get' | 'patch';

function methodToJson(
    method: HttpMethod,
    url: string,
    data: Record<any, any>,
    config: RequestInit,
    operation?: string,
) {
    // prettier-ignore
    return fetchToJson(url, {
        ...{
            method,
            headers: defaultHeaders,
            body: Object.keys(data).length === 0 ? undefined : JSON.stringify(data)
        },
        ...config
    }, operation);
}

export function postAsJson(url: string, data = {}, operation?: string) {
    return methodToJson('post', url, data, {}, operation);
}

export function putAsJson(url: string, data = {}, config = {}, operation?: string) {
    return methodToJson('put', url, data, config, operation);
}
