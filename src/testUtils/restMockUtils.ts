import { aktivitestplanResponse, aktivitetResponse, handlers } from '../mocks/handlers';
import { failOrGrahpqlResponse } from '../mocks/utils';
import { rest } from 'msw';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { Dialog } from '../datatypes/dialogTypes';

export const handlersWithGraphqlOverride = ({
    aktiviteter,
    dialoger,
}: {
    aktiviteter: VeilarbAktivitet[];
    dialoger: Dialog[];
}) => {
    return [
        rest.post(
            '/veilarbaktivitet/graphql',
            failOrGrahpqlResponse(
                () => false,
                async (req) => {
                    const body = (await req.json()) as { query: string; variables: Record<string, any> };
                    const aktivitetId = body.variables.aktivitetId;
                    if (aktivitetId) {
                        return aktivitetResponse(aktiviteter.find((aktivitet) => aktivitet.id == aktivitetId)!);
                    } else {
                        return aktivitestplanResponse({ aktiviteter });
                    }
                },
            ),
        ),
        rest.post(
            '/veilarbdialog/graphql',
            failOrGrahpqlResponse(
                () => false,
                () => {
                    return { data: { dialoger } };
                },
            ),
        ),
        ...handlers.filter((handler) => !(handler.info.path as string).includes('graphql')),
    ];
};
