/*eslint:disable*/
import fetchmock from 'fetch-mock';
import qs from 'query-string';
import pathRegex from 'path-to-regexp';


export const MOCK_CONFIG = {
    failureRate: -1,
    seed: 9001
};

export function rnd(start, stop) {
    return Math.round(Math.random() * (stop - start) + start);
}

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
    return () => new Promise((resolve) => setTimeout(() => resolve(response), time));
}

export function respondWith(handler) {
    return (url, config, extra) => {
        const queryParams = qs.parse(qs.extract(url));
        const bodyParams = config.body && JSON.parse(config.body);

        let response;

        if (typeof handler === 'function') {
            response = handler(url, config, { queryParams, bodyParams, extra });
        } else {
            response = handler; // Trust me, its data
        }

        console.groupCollapsed(url);
        console.groupCollapsed('config');
        console.log('url', url);
        console.log('config', config);
        console.log('queryParams', queryParams);
        console.log('bodyParams', bodyParams);
        console.log('extra', extra);
        console.groupEnd();

        console.log('response', response);
        console.groupEnd();

        return response;
    };
}

fetchmock._mock(); // Må kalles slik at window.fetch blir byttet ut
export const mock = ['get', 'post', 'put', 'delete', 'head', 'patch', 'mock']
    .map((method) => ({
        [method]: (...args) => {
            const handler = args.pop();
            const routeurl = args[0];

            let preprocessor;
            if (routeurl.startsWith('express:')) {
                const pureUrl = routeurl.replace(/^express:/, '');
                const keys = [];
                const regexp = pathRegex(pureUrl, keys);

                preprocessor = (url) => {
                    const result = regexp.exec(url);
                    return result && keys
                        .map((key, index) => {
                            if (key.name && result[index]) {
                                return { [key.name]: result[index] };
                            }
                            return null;
                        })
                        .filter((obj) => obj !== null)
                        .reduce((acc, obj) => ({ ...acc, ...obj }), {});
                };
            }

            return fetchmock[method](...args, (url, ...handlerArgs) => {
                const extra = (preprocessor && preprocessor(url, ...handlerArgs, ...args)) || {};
                extra.args = args;
                return handler(url, ...handlerArgs, extra);
            });
        }
    }))
    .reduce((acc, method) => ({ ...acc, ...method }), {});

mock.realFetch = fetchmock.realFetch;
