import { ResponseComposition, RestContext, RestRequest } from 'msw';

export const mockfnr = '12345678910';
export const mockAktivEnhet = '0909';

export const rndId = (): string => {
    return `${Math.floor(Math.random() * 100000000)}`;
};

export const delayed = (ms: any, handler: any) => {
    return async (req: any, res: any, ctx: any) => {
        await new Promise((f) => setTimeout(f, ms));
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

export const failOrGetResponse = (
    failFn: () => boolean,
    successFn: (req: RestRequest) => object | undefined,
    delay?: number | undefined,
) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (failFn()) {
            return res(...internalServerError(ctx));
        }
        if (delay) {
            ctx.delay(delay);
        }
        return res(ctx.json(await successFn(req)));
    };
};

export const failOrGrahpqlResponse = (failFn: () => boolean, successFn: (req: RestRequest) => object | undefined) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (failFn()) {
            const failResponse = {
                data: undefined,
                errors: [{ message: 'Kunne ikke hente aktiviteter (graphql)' }],
            };
            return res(ctx.json(failResponse));
        }
        return res(ctx.json(await successFn(req)));
    };
};

export const jsonResponse = (response: object | null | boolean | ((req: RestRequest) => object)) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (typeof response === 'function') {
            return res(ctx.json(await response(req)));
        }
        return res(ctx.json(response));
    };
};
