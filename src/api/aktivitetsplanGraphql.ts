import { DEFAULT_CONFIG, sjekkStatuskode, toJson } from './utils';
import { AKTIVITET_GRAPHQL_BASE_URL } from '../environment';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { GraphqlResponse, sjekkGraphqlFeil } from './graphql/graphqlResult';
import { Historikk } from '../datatypes/Historikk';
import { AktivitetsId, AktivitetsVersjon, OppfolgingsPeriodeId } from '../datatypes/brandedTypes';

const allAktivitetFields = `
    id,
    funksjonellId,
    versjon,
    tittel,
    beskrivelse,
    lenke,
    type,
    status,
    fraDato,
    tilDato,
    opprettetDato,
    endretDato,
    endretAv,
    historisk,
    avsluttetKommentar,
    avtalt,
    forhaandsorientering {
        id,
        type,
        tekst,
        lestDato,
    }
    endretAvType,
    transaksjonsType,
    malid,
    oppfolgingsperiodeId,

    #   stillingaktivitet
    etikett,
    kontaktperson,
    arbeidsgiver,
    arbeidssted,
    stillingsTittel,

    #    // egenaktivitet
    hensikt,
    oppfolging,

    #    //sokeAvtaleAktivitet
    antallStillingerSokes,
    antallStillingerIUken,
    avtaleOppfolging,

    #    //iJobbAktivitet
    jobbStatus,
    ansettelsesforhold,
    arbeidstid,

    #    //behandlingAktivitet
    behandlingType,
    behandlingSted,
    effekt,
    behandlingOppfolging,

    #    //møte
    adresse,
    forberedelser,
    kanal,
    referat,
    erReferatPublisert,

    stillingFraNavData {
        cvKanDelesData {
            kanDeles,
            endretTidspunkt,
            endretAv,
            endretAvType,
            avtaltDato,
        }
        soknadsfrist,
        svarfrist,
        arbeidsgiver,
        bestillingsId,
        stillingsId,
        arbeidssted,
        kontaktpersonData {
            navn,
            tittel,
            mobil,
        }
        soknadsstatus,
        livslopsStatus,
        varselId,
        detaljer,
    }

    eksternAktivitet {
        type,
        oppgave {
            ekstern {
                subtekst,
                tekst,
                url
            }
            intern {
                subtekst,
                tekst,
                url
            }
        }
        handlinger {
            url,
            tekst,
            subtekst,
            lenkeType
        }
        detaljer {
            label,
            verdi
        }
        etiketter {
            tekst,
            kode,
            sentiment
        }
    }
`;

const alleAktiviteterQuery: string = `
    query($fnr: String!) {
        perioder(fnr: $fnr) {
            id,
            start,
            slutt,
            aktiviteter {
                ${allAktivitetFields}
            },
        }
    }
`;

const historikkFields = `
    endringer {
        endretAvType,
        endretAv,
        tidspunkt,
        beskrivelseForVeileder,
        beskrivelseForBruker,
        versjonsId
    }
`;

const historikkQuery = `
    query($aktivitetId: String!) {
        aktivitet(aktivitetId: $aktivitetId) {
            historikk {
                ${historikkFields}
            }
        }
    }
`;

const aktivitetQuery = `
    query($aktivitetId: String!) {
        eier(aktivitetId: $aktivitetId) {
            fnr
        },
        aktivitet(aktivitetId: $aktivitetId) {
            ${allAktivitetFields}
            historikk {
                ${historikkFields}
            }
        }

    }
`;

const gammeltReferatQuery = `
    query($aktivitetId: String!, $versjon: String!) {
        aktivitet(aktivitetId: $aktivitetId, versjon: $versjon) {
            tittel
            id
            referat
        }
    }
`;

const alleAktiviteterQueryBody = (fnr: string) => ({
    query: alleAktiviteterQuery,
    variables: {
        fnr,
    },
});

const aktivitetQueryBody = (aktivitetId: string) => ({
    query: aktivitetQuery,
    variables: {
        aktivitetId,
    },
});

const aktivitetHistorikkQueryBody = (aktivitetId: AktivitetsId) => ({
    query: historikkQuery,
    variables: {
        aktivitetId,
    },
});

const gammelReferatQueryBody = (aktivitetId: AktivitetsId, versjon: AktivitetsVersjon) => ({
    query: gammeltReferatQuery,
    variables: {
        aktivitetId,
        versjon,
    },
});

interface OppfolgingsPerioder {
    id: OppfolgingsPeriodeId;
    aktiviteter: VeilarbAktivitet[];
    start: string;
    slutt: string | undefined;
}

export type AktivitetsplanResponse = GraphqlResponse<{ perioder: OppfolgingsPerioder[] }>;

const fetchFromGraphql = (body: string) =>
    fetch(AKTIVITET_GRAPHQL_BASE_URL, {
        ...DEFAULT_CONFIG,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'aktivitetsplan',
        },
        body: body,
    });

export const hentAktiviteterGraphql = async (): Promise<AktivitetsplanResponse> => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR) || '';
    return fetchFromGraphql(JSON.stringify(alleAktiviteterQueryBody(fnr)))
        .then((response) => sjekkStatuskode(response, 'hentAktiviteterGraphql'))
        .then(toJson)
        .then(sjekkGraphqlFeil<{ perioder: OppfolgingsPerioder[] }>);
};

export type AktivitetMedHistorikk = VeilarbAktivitet & {
    historikk: Historikk;
    id: AktivitetsId;
    oppfolgingsperiodeId: OppfolgingsPeriodeId;
};

export const hentAktivitetGraphql = (aktivitetId: AktivitetsId) => {
    return fetchFromGraphql(JSON.stringify(aktivitetQueryBody(aktivitetId)))
        .then((response) => sjekkStatuskode(response, 'hentAktivitetGraphql'))
        .then(toJson)
        .then(
            sjekkGraphqlFeil<{
                aktivitet: AktivitetMedHistorikk;
                eier: { fnr: string };
            }>,
        )
        .then((it) => ({
            ...it,
            data: {
                aktivitet: { ...it.data.aktivitet, id: aktivitetId as AktivitetsId },
                eier: { fnr: it.data.eier.fnr },
            },
        }));
};

export interface TidligereReferatAktivitet {
    tittel: string;
    id: AktivitetsId;
    referat: string | null;
}

export const hentAktivitetsHistorikkGraphql = (aktivitetId: AktivitetsId) => {
    return fetchFromGraphql(JSON.stringify(aktivitetHistorikkQueryBody(aktivitetId)))
        .then((response) => sjekkStatuskode(response, 'hentAktivitetHistorikkGraphql'))
        .then(toJson)
        .then(sjekkGraphqlFeil<{ aktivitet: { historikk: Historikk; id: AktivitetsId } }>);
};
export const hentAktivitetsVersjonGraphql = (aktivitetId: AktivitetsId, versjon: AktivitetsVersjon) => {
    return fetchFromGraphql(JSON.stringify(gammelReferatQueryBody(aktivitetId, versjon)))
        .then((response) => sjekkStatuskode(response, 'hentAktivitetVersjonGraphql'))
        .then(toJson)
        .then(sjekkGraphqlFeil<{ aktivitet: TidligereReferatAktivitet }>);
};
