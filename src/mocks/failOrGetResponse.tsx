import { HandlerResponseElement, MockContext, MockHandler, ResponseData } from 'yet-another-fetch-mock';

export const internalServerError = (ctx: MockContext): Array<HandlerResponseElement> => [
    ctx.status(500),
    ctx.statusText('Internal server error'),
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

export function failOrGetResponse(
    failFn: () => boolean,
    successFn: (params: string, body: object) => object
): MockHandler {
    return (req, res, ctx): Promise<ResponseData> => {
        if (failFn()) {
            return res(...internalServerError(ctx));
        }
        return res(ctx.json(successFn(req.pathParams, req.body)));
    };
}
