import { DefaultBodyType, HttpResponseResolver, PathParams, StrictRequest } from 'msw';

export const mockfnr = '12345678910';

export const rndId = (): string => {
    return `${Math.floor(Math.random() * 100000000)}`;
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
    successFn: (req: StrictRequest<T>, params: PathParams) => object | undefined,
): HttpResponseResolver => {
    return async ({ request, params }) => {
        if (failFn()) {
            return internalServerError;
        }
        return new Response(JSON.stringify(await successFn(request, params)));
    };
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
            return new Response(JSON.stringify(failResponse));
        }
        return new Response(JSON.stringify(await successFn(request)));
    };
};

type MockPayload = object | null | boolean | ((req: StrictRequest<any>) => object);

export const jsonResponse = (response: MockPayload): HttpResponseResolver => {
    return async ({ request }) => {
        if (typeof response === 'function') {
            return new Response(JSON.stringify(await response(request)));
        }
        return new Response(JSON.stringify(response));
    };
};
