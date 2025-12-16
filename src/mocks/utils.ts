import { DefaultBodyType, HttpResponseResolver, PathParams, StrictRequest, delay as _delay, HttpResponse } from 'msw';

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

export const internalServerError = new Response(
    JSON.stringify({
        id: '9170c6534ed5eca272d527cd30c6a458',
        type: 'UKJENT',
        detaljer: {
            detaljertType: 'javax.ws.rs.InternalServerErrorException',
            feilMelding: 'HTTP 500 Internal Server Error',
            stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t',
        },
    }),
    { status: 500 },
);

export const failOrGetResponse = <T extends DefaultBodyType = DefaultBodyType>(
    failFn: () => boolean,
    successFn: (req: StrictRequest<T>, params: PathParams) => (object | undefined) | Promise<object | undefined>,
    delay?: number | undefined,
    successResponseCode?: number
): HttpResponseResolver<PathParams, T, T> => {
    return (async ({ request, params }): Promise<Response> => {
        if (failFn()) {
            return internalServerError;
        }
        if (delay) await _delay(delay);
        const result = await successFn(request, params);
        return new Response(JSON.stringify(result), {status: successResponseCode ? successResponseCode : 200});
    }) as HttpResponseResolver<PathParams, T, T>;
};

export const failOrGrahpqlResponse = (
    failFn: () => boolean,
    successFn: (req: StrictRequest<DefaultBodyType>) => object | undefined,
): HttpResponseResolver => {
    return async ({ request }) => {
        if (failFn()) {
            const failResponse = {
                data: undefined,
                errors: [{ message: 'Kunne ikke hente aktiviteter (graphql)' }],
            };
            return new HttpResponse(JSON.stringify(failResponse));
        }
        return new HttpResponse(JSON.stringify(await successFn(request)));
    };
};

type MockPayload = object | null | boolean | ((req: StrictRequest<any>) => object);

export const jsonResponse = (response: MockPayload): HttpResponseResolver => {
    return async ({ request }) => {
        if (typeof response === 'function') {
            return new HttpResponse(JSON.stringify(await response(request)));
        }
        return new HttpResponse(JSON.stringify(response));
    };
};
