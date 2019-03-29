/*eslint:disable*/

export function fetchmockMiddleware(request, response) {
    console.groupCollapsed(request.url);
    console.groupCollapsed('config');
    console.log('url', request.url);
    console.log('queryParams', request.queryParams);
    console.log('pathParams', request.pathParams);
    console.log('body', request.body);
    console.groupEnd();

    console.log('response', JSON.parse(response.body || '{}'));
    console.groupEnd();
    return response;
}

export function rndId() {
    return `${Math.floor(Math.random() * 100000000)}`;
}
