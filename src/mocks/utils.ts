/*eslint:disable*/

import { ResponseComposition, RestContext, RestRequest } from 'msw';

export const fetchmockMiddleware = (request: any, response: any) => {
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
};

export const rndId = (): string => {
    return `${Math.floor(Math.random() * 100000000)}`;
};

export const delayed = (ms: any, handler: any) => {
    return async (req: any, res: any, ctx: any) => {
        await ctx.delay(ms)({});
        return handler(req, res, ctx);
    };
};

export const internalServerError = (ctx: RestContext) => {
    return [
        ctx.status(500, 'Internal server error'),
        ctx.json({
            id: '9170c6534ed5eca272d527cd30c6a458',
            type: 'UKJENT',
            detaljer: {
                detaljertType: 'javax.ws.rs.InternalServerErrorException',
                feilMelding: 'HTTP 500 Internal Server Error',
                stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t',
            },
        }),
    ];
};

export const failOrGetResponse = (failFn: () => boolean, successFn: (req: RestRequest) => object | undefined) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (failFn()) {
            return res(...internalServerError(ctx));
        }
        return res(ctx.json(await successFn(req)));
    };
};

// export const failOrGetResponse = (
//     failFn: () => boolean,
//     successRes: object | ((req: RestRequest) => object | undefined)
// ) => {
//     return (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
//         if (failFn()) {
//             return res(...internalServerError(ctx));
//         }
//         if (typeof successRes === 'function') {
//             return res(ctx.json(successRes(req)));
//         }
//         return res(ctx.json(successRes));
//     };
// };

export const jsonResponse = (response: object | null | boolean | ((req: RestRequest) => object)) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (typeof response === 'function') {
            return res(ctx.json(await response(req)));
        }
        return res(ctx.json(response));
    };
};
