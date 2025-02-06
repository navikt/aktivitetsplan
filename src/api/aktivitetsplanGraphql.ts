import { DEFAULT_CONFIG, sjekkStatuskode, toJson } from './utils';
import { AKTIVITET_GRAPHQL_BASE_URL } from '../environment';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { GraphqlResponse, sjekkGraphqlFeil } from './graphql/graphqlResult';
import { Historikk } from '../datatypes/Historikk';

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

const query: string = `
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

const aktivitetQuery = `
    query($aktivitetId: String!) {
        eier(aktivitetId: $aktivitetId) {
            fnr
        },
        aktivitet(aktivitetId: $aktivitetId) {
            ${allAktivitetFields}
            historikk {
                endringer {
                    endretAvType,
                    endretAv,
                    tidspunkt,
                    beskrivelseForVeileder,
                    beskrivelseForBruker,
                }
            }
        }

    }
`;

const queryBody = (fnr: string) => ({
    query,
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

interface OppfolgingsPerioder {
    id: string;
    aktiviteter: VeilarbAktivitet[];
    start: string;
    slutt: string | undefined;
}

export type AktivitetsplanResponse = GraphqlResponse<{ perioder: OppfolgingsPerioder[] }>;

export const hentAktiviteterGraphql = async (): Promise<AktivitetsplanResponse> => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR) || '';
    return fetch(AKTIVITET_GRAPHQL_BASE_URL, {
        ...DEFAULT_CONFIG,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'aktivitetsplan',
        },
        body: JSON.stringify(queryBody(fnr)),
    })
        .then(sjekkStatuskode)
        .then(toJson)
        .then(sjekkGraphqlFeil<{ perioder: OppfolgingsPerioder[] }>);
};

export const hentAktivitetGraphql = (aktivitetId: string) => {
    return fetch(AKTIVITET_GRAPHQL_BASE_URL, {
        ...DEFAULT_CONFIG,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'aktivitetsplan',
        },
        body: JSON.stringify(aktivitetQueryBody(aktivitetId)),
    })
        .then(sjekkStatuskode)
        .then(toJson)
        .then(
            sjekkGraphqlFeil<{
                aktivitet: VeilarbAktivitet & { historikk: Historikk; id: string; oppfolgingsperiodeId: string };
                eier: { fnr: string };
            }>,
        )
        .then((it) => ({
            ...it,
            data: {
                aktivitet: { ...it.data.aktivitet, id: aktivitetId },
                eier: { fnr: it.data.eier.fnr },
            },
        }));
};
