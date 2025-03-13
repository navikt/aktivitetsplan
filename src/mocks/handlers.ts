import { rest } from 'msw';

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
    publiserReferat,
} from './aktivitet';
import { arena, oppdaterArenaaktivitet, oppdaterLestFhoArenaaktivitet } from './data/arena';
import { auth } from './data/auth';
import dialoger from './data/dialog';
import { eskaleringsvarsel } from './data/eskaleringsvarsel';
import { features } from './data/feature';
import { lest } from './data/lest';
import { malListe, opprettMal, sisteMal } from './data/mal';
import { hentMalverk } from './data/malverk';
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
    rest.get('/auth/info', jsonResponse(auth)),

    // veilarboppfolging
    rest.get('/veilarboppfolging/api/v3/oppfolging/me', failOrGetResponse(getOppfFeiler, me)),
    rest.post('/veilarboppfolging/api/v3/oppfolging/hent-status', failOrGetResponse(getOppfFeiler, getOppfolging)),
    rest.post('/veilarboppfolging/api/v3/oppfolging/harFlereAktorIderMedOppfolging', jsonResponse(true)),
    rest.post('/veilarboppfolging/api/v3/hent-maal', failOrGetResponse(getMaalFeiler, sisteMal)),
    rest.post('/veilarboppfolging/api/v3/maal/hent-alle', failOrGetResponse(getMaalFeiler, malListe)),
    rest.post('/veilarboppfolging/api/v3/maal', failOrGetResponse(maalFeilet, opprettMal)),
    rest.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', (_, res, ctx) => res(ctx.status(204))),
    rest.post('/veilarboppfolging/api/v3/veileder/lest-aktivitetsplan', (_, res, ctx) => res(ctx.status(204))),
    rest.post('/veilarboppfolging/api/v3/oppfolging/settDigital', failOrGetResponse(oppfFeilet, settDigital)),

    // veilarbdialog
    rest.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', jsonResponse(eskaleringsvarsel)),
    rest.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse({ sistOppdatert: 1678793406845 })),
    rest.post(
        '/veilarbdialog/graphql',
        failOrGrahpqlResponse(dialogFeilet, () => ({
            data: {
                dialoger,
                stansVarsel: eskaleringsvarsel,
            },
        })),
    ),

    // veilarbaktivitet
    rest.post('/veilarbaktivitet/api/logger/event', (_, res, ctx) => res(ctx.status(200))),
    rest.get(
        '/veilarbaktivitet/api/aktivitet',
        failOrGetResponse(getAktivitetFeiler, () => aktiviteterData),
    ),
    rest.post(
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
        }),
    ),
    rest.post(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(
            () => arenaFeilet() && !oppdateringKunFeiler(),
            () => arena,
        ),
    ),
    rest.get(
        '/veilarbaktivitet/api/aktivitet/kanaler',
        failOrGetResponse(getAktivitetFeiler, () => ['INTERNETT', 'OPPMOTE', 'TELEFON']),
    ),
    rest.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterArenaaktivitet),
    ),
    rest.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering/lest',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterLestFhoArenaaktivitet),
    ),
    rest.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(getAktivitetFeiler, getAktivitet)),
    rest.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet)),
    rest.post(
        '/veilarbaktivitet/api/aktivitet/:oppfolgingsperiode/ny',
        failOrGetResponse(aktivitetFeilet, opprettAktivitet),
    ),
    rest.get(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
        failOrGetResponse(getAktivitetFeiler, getAktivitetVersjoner),
    ),
    rest.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/status',
        failOrGetResponse(aktivitetFeilet, oppdaterAktivitetStatus),
    ),
    // todo sjekk ut denne, tror ikke det kun er stillingsaktivitet
    rest.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett',
        failOrGetResponse(aktivitetFeilet, oppdaterEtikett),
    ),
    rest.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser',
        failOrGetResponse(aktivitetFeilet, publiserReferat),
    ),
    rest.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', failOrGetResponse(aktivitetFeilet, endreReferat)),
    rest.put('/veilarbaktivitet/api/avtaltMedNav', failOrGetResponse(aktivitetFeilet, oppdaterAvtaltMedNav)),
    rest.put('/veilarbaktivitet/api/avtaltMedNav/lest', failOrGetResponse(aktivitetFeilet, oppdaterLestFho)),
    rest.put(
        '/veilarbaktivitet/api/stillingFraNav/kanDeleCV',
        failOrGetResponse(aktivitetFeilet, oppdaterCVKanDelesSvar),
    ),
    rest.put(
        '/veilarbaktivitet/api/stillingFraNav/soknadStatus',
        failOrGetResponse(aktivitetFeilet, oppdaterStillingFraNavSoknadsstatus),
    ),
    rest.get('/veilarbaktivitet/api/feature', jsonResponse(features)),
    rest.get(
        '/veilarbaktivitet/api/arkivering/forhaandsvisning',
        failOrGetResponse(forhaandsvisningFeiler, () => pdfForhaandsvisning, 500),
    ),
    rest.post(
        '/veilarbaktivitet/api/arkivering/journalfor',
        failOrGetResponse(journalforingFeiler, () => journalføring, 2000),
    ),
    rest.post('/veilarbaktivitet/api/innsynsrett', jsonResponse({ foresatteHarInnsynsrett: erUnder18() })),
    // veilarblest
    rest.post('/veilarblest/api/aktivitetsplan/les', jsonResponse(lest)),
    rest.put('/veilarblest/api/informasjon/les', jsonResponse(lest)),

    // veilarbperson
    rest.post('/veilarbperson/api/v3/hent-person', jsonResponse(getPerson)),
    rest.post('/veilarbperson/api/v3/person/hent-postadresse', jsonResponse(getPostadresse)),

    // veilarbveileder
    rest.get('/veilarbveileder/api/veileder/me', jsonResponse(veilederMe)),

    // veilarboppgave
    rest.get('/veilarboppgave/api/oppgavehistorikk', jsonResponse([])),

    // veilarbmalverk
    rest.post('/veilarbmalverk/api/mal', jsonResponse(hentMalverk)),

    // tryggtekst
    rest.post('/tryggtekst/proxy', sjekkTryggTekst),
];

export const aktivitestplanResponse = (
    { aktiviteter }: { aktiviteter: VeilarbAktivitet[] } = { aktiviteter: aktiviteterData.aktiviteter },
): AktivitetsplanResponse => {
    return {
        data: {
            perioder: mockOppfolging.oppfolgingsPerioder.map((periode) => ({
                id: periode.uuid,
                aktiviteter: aktiviteter.filter((aktivitet) => aktivitet.oppfolgingsperiodeId === periode.uuid),
                start: periode.startDato,
                slutt: periode.sluttDato ?? undefined,
            })),
        },
    };
};

export const aktivitetResponse = (aktivitet: VeilarbAktivitet) => {
    const now = new Date();
    return {
        data: {
            eier: {
                fnr: '13837597573',
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
                            beskrivelseForBruker: 'Du endret detaljer på aktiviteten',
                        },
                        {
                            endretAvType: 'NAV',
                            endretAv: 'R121212',
                            tidspunkt: subMinutes(new Date(), 30),
                            beskrivelseForVeileder: 'R121212 merket aktiviteten "Avtalt med Nav"',
                            beskrivelseForBruker: 'Nav merket aktiviteten "Avtalt med Nav"',
                        },
                        {
                            endretAvType: 'BRUKER',
                            endretAv: '2121212121212',
                            tidspunkt: subDays(new Date(), 2),
                            beskrivelseForVeileder: 'Bruker flyttet aktiviteten fra Planlegger til Forslag',
                            beskrivelseForBruker: 'Du flyttet aktiviteten fra Planlegger til Forslag',
                        },
                    ],
                },
            },
        },
    };
};
