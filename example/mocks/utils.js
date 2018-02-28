/*eslint:disable*/
import fetchmock from 'fetch-mock';
import qs from 'query-string';
import pathRegex from 'path-to-regexp';

export const MOCK_CONFIG = {
    failureRate: -1,
    seed: 9001,
};

export function randomFailure(fn) {
    return (...args) => {
        const shouldFail = Math.random() <= MOCK_CONFIG.failureRate;
        if (shouldFail) {
            return 500;
        }

        if (typeof fn === 'function') {
            return fn(...args);
        }
        return fn; // Trust me, its data
    };
}

export function delayed(time, response) {
    return () =>
        new Promise(resolve => setTimeout(() => resolve(response), time));
}

export function respondWith(handler) {
    return (url, config, matcherUrl) => {
        const queryParams = qs.parse(qs.extract(url));
        const body = config.body && JSON.parse(config.body);
        const { matches, keys } = parsePath(matcherUrl, url);
        const pathParams = Object.assign(
            {},
            ...keys.map(({ name }, index) => ({ [name]: matches[index + 1] }))
        );

        let response;

        if (typeof handler === 'function') {
            response = handler({ queryParams, body, pathParams, url, config });
        } else {
            response = handler; // Trust me, its data
        }

        const method = config.method || 'get';

        console.groupCollapsed(method.toUpperCase() + ' ' + url);
        console.groupCollapsed('config');
        console.log('url', url);
        console.log('config', config);
        console.log('pathParams', pathParams);
        console.log('queryParams', queryParams);
        console.log('body', body);
        console.groupEnd();
        console.log('response', response);
        console.groupEnd();

        if (response instanceof Response) {
            return response;
        }
        return JSON.stringify(response);
    };
}

function parsePath(matcherUrl, url) {
    const keys = [];
    const regexp = pathRegex(matcherUrl, keys);
    const urlWithoutQueryString = url.split('?')[0];
    return { matches: regexp.exec(urlWithoutQueryString), keys };
}

function createMatcherFromUrl(matcherUrl, method) {
    return (url, options) => {
        const usedMethod = (options && options.method) || 'get';
        return usedMethod === method && !!parsePath(matcherUrl, url).matches;
    };
}

function createFetchmockProxy(method) {
    return (matcherUrl, handler) =>
        fetchmock[method](
            createMatcherFromUrl(matcherUrl, method),
            (url, config) => handler(url, config, matcherUrl)
        );
}

export const mock = {
    get: createFetchmockProxy('get'),
    post: createFetchmockProxy('post'),
    put: createFetchmockProxy('put'),
    delete: createFetchmockProxy('delete'),
};

fetchmock._mock(); // Må kalles slik at window.fetch blir byttet ut
mock.realFetch = fetchmock.realFetch;
