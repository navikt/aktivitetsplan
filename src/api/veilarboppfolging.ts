import { postAsJson } from './utils';
import { OPPFOLGING_BASE_URL } from '../environment';
import { GraphqlResponse } from './graphql/graphqlResult';
import { OppfolgingsPeriodeId } from '../datatypes/brandedTypes';

interface KvpPeriode {
    startTidspunkt: string;
    sluttTidspunkt: string | undefined | null;
}

interface OppfolgingsPeriode {
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
            inaktiveringsdato: string;
            kanReaktiveres: boolean;
        };
    };
    oppfolgingsperioder: OppfolgingsPeriode[];
    oppfolging: {
        erUnderOppfolging: boolean;
    };
}

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
        oppfolgingsPerioder {
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
    postAsJson(`${OPPFOLGING_BASE_URL}/graphql`, query(fnr), 'fetchOppfolging');
