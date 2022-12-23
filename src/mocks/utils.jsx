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

export function delayed(ms, handler) {
    return async (req, res, ctx) => {
        await ctx.delay(ms)({});
        return handler(req, res, ctx);
    };
}

export function jsonResponse(json) {
    return (req, res, ctx) => res(ctx.json(json));
}
