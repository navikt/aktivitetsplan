import { http, HttpResponse } from 'msw';

import {
    aktiviteterData,
    endreReferat,
    getAktivitet,
    getAktivitetVersjoner,
    oppdaterAktivitet,
    oppdaterAktivitetStatus,
    oppdaterAvtaltMedNav,
    oppdaterCVKanDelesSvar,
    oppdaterEtikett,
    oppdaterLestFho,
    oppdaterStillingFraNavSoknadsstatus,
    opprettAktivitet,
    publiserReferat
} from './aktivitet';
import { arena, oppdaterArenaaktivitet, oppdaterLestFhoArenaaktivitet } from './data/arena';
import { auth } from './data/auth';
import dialoger from './data/dialog';
import { eskaleringsvarsel } from './data/eskaleringsvarsel';
import { features } from './data/feature';
import { lest } from './data/lest';
import { malListe, opprettMal, sisteMal } from './data/mal';
import { me } from './data/me';
import getOppfolging, { mockOppfolging, settDigital } from './data/oppfolging';
import { getPerson, getPostadresse } from './data/person';
import { veilederMe } from './data/Veileder';
import pdfForhaandsvisning from './fixtures/pdfForhaandsvisning.json';
import {
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    erUnder18,
    forhaandsvisningFeiler,
    journalforingFeiler,
    maalFeilet,
    oppdateringKunFeiler,
    oppfFeilet,
    sendTilBrukerFeiler
} from './demo/localStorage';
import { failOrGetResponse, failOrGrahpqlResponse, jsonResponse } from './utils';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { journalføring } from './data/journalføring';
import { subDays, subMinutes } from 'date-fns';
import { AktivitetsplanResponse } from '../api/aktivitetsplanGraphql';
import { sjekkTryggTekst } from './data/tryggtekst';

const getOppfFeiler = () => oppfFeilet() && !oppdateringKunFeiler();
const getMaalFeiler = () => maalFeilet() && !oppdateringKunFeiler();
const getAktivitetFeiler = () => aktivitetFeilet() && !oppdateringKunFeiler();

export const handlers = [
    http.get('/auth/info', jsonResponse(auth)),

    // veilarboppfolging
    http.get('/veilarboppfolging/api/v3/oppfolging/me', failOrGetResponse(getOppfFeiler, me)),
    http.post('/veilarboppfolging/api/v3/oppfolging/hent-status', failOrGetResponse(getOppfFeiler, getOppfolging)),
    http.post('/veilarboppfolging/api/v3/oppfolging/harFlereAktorIderMedOppfolging', jsonResponse(true)),
    http.post('/veilarboppfolging/api/v3/hent-maal', failOrGetResponse(getMaalFeiler, sisteMal)),
    http.post('/veilarboppfolging/api/v3/maal/hent-alle', failOrGetResponse(getMaalFeiler, malListe)),
    http.post('/veilarboppfolging/api/v3/maal', failOrGetResponse(maalFeilet, opprettMal)),
    http.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', () => {
        return new HttpResponse(null, {
            status: 204
        });
    }),
    http.post('/veilarboppfolging/api/v3/veileder/lest-aktivitetsplan', () => {
        return new HttpResponse(null, {
            status: 204
        });
    }),
    http.post('/veilarboppfolging/api/v3/oppfolging/settDigital', failOrGetResponse(oppfFeilet, settDigital)),

    // veilarbdialog
    http.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', jsonResponse(eskaleringsvarsel)),
    http.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse({ sistOppdatert: 1678793406845 })),
    http.post(
        '/veilarbdialog/graphql',
        failOrGrahpqlResponse(dialogFeilet, () => ({
            data: {
                dialoger,
                stansVarsel: eskaleringsvarsel
            }
        }))
    ),

    // veilarbaktivitet
    http.post('/veilarbaktivitet/api/logger/event', (_, res, ctx) => res(ctx.status(200))),
    http.get(
        '/veilarbaktivitet/api/aktivitet',
        failOrGetResponse(getAktivitetFeiler, () => aktiviteterData)
    ),
    http.post(
        '/veilarbaktivitet/graphql',
        failOrGrahpqlResponse(getAktivitetFeiler, async (req) => {
            const body = (await req.json()) as { query: string; variables: Record<string, any> };
            const aktivitetId = body.variables.aktivitetId;
            if (aktivitetId) {
                const aktivitet = aktiviteterData.aktiviteter.find((it) => it.id === aktivitetId);
                await new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
                return aktivitetResponse(aktivitet);
            } else {
                return aktivitestplanResponse(); // Default aktiviteter
            }
        })
    ),
    http.post(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(
            () => arenaFeilet() && !oppdateringKunFeiler(),
            () => arena
        )
    ),
    http.get(
        '/veilarbaktivitet/api/aktivitet/kanaler',
        failOrGetResponse(getAktivitetFeiler, () => ['INTERNETT', 'OPPMOTE', 'TELEFON'])
    ),
    http.put(
        '/veilarbaktivitet/api/arena/:oppfolgingsperiode/forhaandsorientering',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterArenaaktivitet)
    ),
    http.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering/lest',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterLestFhoArenaaktivitet)
    ),
    http.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(getAktivitetFeiler, getAktivitet)),
    http.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet)),
    http.post(
        '/veilarbaktivitet/api/aktivitet/:oppfolgingsperiode/ny',
        failOrGetResponse(aktivitetFeilet, opprettAktivitet)
    ),
    http.get(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
        failOrGetResponse(getAktivitetFeiler, getAktivitetVersjoner)
    ),
    http.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/status',
        failOrGetResponse(aktivitetFeilet, oppdaterAktivitetStatus)
    ),
    // todo sjekk ut denne, tror ikke det kun er stillingsaktivitet
    http.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett',
        failOrGetResponse(aktivitetFeilet, oppdaterEtikett)
    ),
    http.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser',
        failOrGetResponse(aktivitetFeilet, publiserReferat)
    ),
    http.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', failOrGetResponse(aktivitetFeilet, endreReferat)),
    http.put('/veilarbaktivitet/api/avtaltMedNav', failOrGetResponse(aktivitetFeilet, oppdaterAvtaltMedNav)),
    http.put('/veilarbaktivitet/api/avtaltMedNav/lest', failOrGetResponse(aktivitetFeilet, oppdaterLestFho)),
    http.put(
        '/veilarbaktivitet/api/stillingFraNav/kanDeleCV',
        failOrGetResponse(aktivitetFeilet, oppdaterCVKanDelesSvar)
    ),
    http.put(
        '/veilarbaktivitet/api/stillingFraNav/soknadStatus',
        failOrGetResponse(aktivitetFeilet, oppdaterStillingFraNavSoknadsstatus)
    ),
    http.get('/veilarbaktivitet/api/feature', jsonResponse(features)),
    http.post(
        '/veilarbaktivitet/api/arkivering/forhaandsvisning',
        failOrGetResponse(forhaandsvisningFeiler, () => pdfForhaandsvisning, 2000)
    ),
    http.post(
        '/veilarbaktivitet/api/arkivering/forhaandsvisning-send-til-bruker',
        failOrGetResponse(forhaandsvisningFeiler, () => pdfForhaandsvisning, 2000)
    ),
    http.post(
        '/veilarbaktivitet/api/arkivering/journalfor',
        failOrGetResponse(journalforingFeiler, () => journalføring, 2000)
    ),
    http.post(
        '/veilarbaktivitet/api/arkivering/send-til-bruker', failOrGetResponse(sendTilBrukerFeiler, () => undefined, 2000, 204)
    ),
    http.post('/veilarbaktivitet/api/innsynsrett', jsonResponse({ foresatteHarInnsynsrett: erUnder18() })),
    // veilarblest
    http.post('/veilarblest/api/aktivitetsplan/les', jsonResponse(lest)),
    http.put('/veilarblest/api/informasjon/les', jsonResponse(lest)),

    // veilarbperson
    http.post('/veilarbperson/api/v3/hent-person', jsonResponse(getPerson)),
    http.post('/veilarbperson/api/v3/person/hent-postadresse', jsonResponse(getPostadresse)),

    // veilarbveileder
    http.get('/veilarbveileder/api/veileder/me', jsonResponse(veilederMe)),

    // veilarboppgave
    http.get('/veilarboppgave/api/oppgavehistorikk', jsonResponse([])),

    // tryggtekst
    http.post('/tryggtekst/proxy/completion', sjekkTryggTekst),

    // Umami tracking
    http.post('https://umami.nav.no/api/send', () => new HttpResponse()),

    // Skyra - noe dekorator tracking greier
    http.post('https://ingest.staging.skyra.no/response', () => new HttpResponse()),
    http.get('https://ingest.staging.skyra.no/survey/arbeids-og-velferdsetaten-nav', () => new HttpResponse()),

    // Browser metadata
    http.get('/site.webmanifest', () => new HttpResponse()),

    // Dekoratoren login
    http.get('https://login.ekstern.dev.nav.no/oauth2/session', () => new HttpResponse())
];

export const aktivitestplanResponse = (
    { aktiviteter }: { aktiviteter: VeilarbAktivitet[] } = { aktiviteter: aktiviteterData.aktiviteter }
): AktivitetsplanResponse => {
    return {
        data: {
            perioder: mockOppfolging.oppfolgingsPerioder.map((periode) => ({
                id: periode.uuid,
                aktiviteter: aktiviteter.filter((aktivitet) => aktivitet.oppfolgingsperiodeId === periode.uuid),
                start: periode.startDato,
                slutt: periode.sluttDato ?? undefined
            }))
        }
    };
};

export const aktivitetResponse = (aktivitet: VeilarbAktivitet) => {
    const now = new Date();
    return {
        data: {
            eier: {
                fnr: '13837597573'
            },
            aktivitet: {
                ...aktivitet,
                historikk: {
                    endringer: [
                        {
                            endretAvType: 'BRUKER',
                            endretAv: '2121212121212',
                            tidspunkt: now,
                            beskrivelseForVeileder: 'Bruker endret detaljer på aktiviteten',
                            beskrivelseForBruker: 'Du endret detaljer på aktiviteten'
                        },
                        {
                            endretAvType: 'NAV',
                            endretAv: 'R121212',
                            tidspunkt: subMinutes(new Date(), 30),
                            beskrivelseForVeileder: 'R121212 merket aktiviteten "Avtalt med Nav"',
                            beskrivelseForBruker: 'Nav merket aktiviteten "Avtalt med Nav"'
                        },
                        {
                            endretAvType: 'BRUKER',
                            endretAv: '2121212121212',
                            tidspunkt: subDays(new Date(), 2),
                            beskrivelseForVeileder: 'Bruker flyttet aktiviteten fra Planlegger til Forslag',
                            beskrivelseForBruker: 'Du flyttet aktiviteten fra Planlegger til Forslag'
                        }
                    ]
                }
            }
        }
    };
};
