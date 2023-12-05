import { DEFAULT_CONFIG, sjekkStatuskode, toJson } from './utils';
import { AKTIVITET_GRAPHQL_BASE_URL } from '../environment';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';

const query: string = `
    query($fnr: String!) {
        perioder(fnr: $fnr) {
            id,
            aktiviteter {
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
            },
        }
    }
`;
const queryBody = (fnr: string) => ({
    query,
    variables: {
        fnr,
    },
});
interface OppfolgingsPerioder {
    id: string;
    aktiviteter: VeilarbAktivitet[];
}

interface GraphqlError {
    message: string;
}
interface AktivitetsplanResponse {
    data: {
        perioder: OppfolgingsPerioder[];
    };
    errors: GraphqlError[];
}

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
        .then(sjekkGraphqlFeil);
};

const sjekkGraphqlFeil = (response: AktivitetsplanResponse): Promise<AktivitetsplanResponse> => {
    if (!response?.data?.perioder && response?.errors.length != 0) {
        return Promise.reject('Kunne ikke hente aktiviteter');
    }
    return Promise.resolve(response);
};
