import { postAsJson } from './utils';
import { OPPFOLGING_BASE_URL } from '../environment';
import { GraphqlResponse, sjekkGraphqlFeil } from './graphql/graphqlResult';
import { OppfolgingsPeriodeId } from '../datatypes/brandedTypes';
import * as z from 'zod';

interface KvpPeriode {
    startTidspunkt: string;
    sluttTidspunkt: string | undefined;
}

export interface OppfolgingsPeriode {
    id: OppfolgingsPeriodeId;
    sluttTidspunkt: string | undefined | null;
    kvpPerioder: KvpPeriode[];
}

export interface OppfolgingStatusResponse {
    brukerStatus: {
        manuell: {
            erManuell: boolean;
        };
        krr: {
            reservertIKrr: boolean;
            kanVarsles: boolean;
            registrertIKrr: boolean;
        };
        arena: {
            inaktiveringsdato: string | undefined;
            kanReaktiveres: boolean | undefined;
        };
    };
    oppfolgingsPerioder: OppfolgingsPeriode[];
    oppfolging: {
        erUnderOppfolging: boolean;
    };
}

const schema = z.object({
    brukerStatus: z.object({
        manuell: z.object({
            erManuell: z.boolean(),
        }),
        krr: z.object({
            reservertIKrr: z.boolean(),
            kanVarsles: z.boolean(),
            registrertIKrr: z.boolean(),
        }),
        arena: z.object({
            inaktiveringsdato: z.string().nullable(),
            kanReaktiveres: z.boolean().nullable(),
        }),
    }),
    oppfolgingsPerioder: z.array(
        z.object({
            id: z.string(),
            sluttTidspunkt: z.string().nullable(),
            kvpPerioder: z.array(
                z.object({
                    startTidspunkt: z.string(),
                    sluttTidspunkt: z.string().nullable(),
                }),
            ),
        }),
    ),
    oppfolging: z.object({
        erUnderOppfolging: z.boolean(),
    }),
});

const oppfolgingStatusQuery = `
    query($fnr: String!) {
        brukerStatus(fnr: $fnr) {
            manuell {
                erManuell
            }
            krr {
                reservertIKrr
                kanVarsles
                registrertIKrr
            }
            arena {
                inaktiveringsdato
                kanReaktiveres
            }
        },
        oppfolging(fnr: $fnr) {
            erUnderOppfolging
        }
        oppfolgingsPerioder(fnr: $fnr) {
            id
            sluttTidspunkt
            kvpPerioder {
                startTidspunkt
                sluttTidspunkt
            }
        }
    }
`;

const query = (fnr: string | undefined) => ({
    query: oppfolgingStatusQuery,
    variables: {
        fnr,
    },
});

export const fetchOppfolging = (fnr: string | undefined): Promise<GraphqlResponse<OppfolgingStatusResponse>> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/graphql`, query(fnr), 'fetchOppfolging')
        .then(sjekkGraphqlFeil<{ data: OppfolgingStatusResponse }>)
        .then((it) => {
            const data = it.data;
            const validationResult = schema.safeParse(data);
            if (!validationResult.success) {
                console.log('Veilarboppfolging graphql validation failed: ', validationResult.error.issues);
            }
            return it.data;
        });
