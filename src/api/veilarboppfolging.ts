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
    };
    oppfolgingsPerioder: OppfolgingsPeriode[];
    oppfolging: {
        erUnderOppfolging: boolean;
    };
    veilederTilgang: {
        harVeilederLeseTilgangTilBrukersKontorsperre: boolean;
    };
}

const schema = z.object({
    brukerStatus: z.object({
        manuell: z.object({
            erManuell: z.boolean().nullable(),
        }),
        krr: z.object({
            reservertIKrr: z.boolean(),
            kanVarsles: z.boolean(),
            registrertIKrr: z.boolean(),
        }),
    }),
    oppfolgingsPerioder: z.array(
        z.object({
            id: z.string(),
            sluttTidspunkt: z.string().optional().nullable(),
            kvpPerioder: z.array(
                z.object({
                    startTidspunkt: z.string(),
                    sluttTidspunkt: z.string().optional().nullable(),
                }),
            ),
        }),
    ),
    oppfolging: z.object({
        erUnderOppfolging: z.boolean(),
    }),
    veilederTilgang: z.object({
        harVeilederLeseTilgangTilBrukersKontorsperre: z.boolean(),
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
        },
        veilederTilgang(fnr: $fnr) {
          harVeilederLeseTilgangTilBrukersKontorsperre
        }
    }
`;

const query = (fnr: string | undefined) => ({
    query: oppfolgingStatusQuery,
    variables: {
        fnr: fnr || '',
    },
});

export const fetchOppfolging = (fnr: string | undefined): Promise<GraphqlResponse<OppfolgingStatusResponse>> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/graphql`, query(fnr), 'fetchOppfolging')
        .then(sjekkGraphqlFeil<{ data: OppfolgingStatusResponse }>)
        .then((it) => {
            const data = it.data;
            const validationResult = schema.safeParse(data);
            if (!validationResult.success) {
                console.warn(
                    'Veilarboppfolging graphql validation failed: ',
                    JSON.stringify(validationResult.error.issues),
                );
            }
            return it.data;
        });
