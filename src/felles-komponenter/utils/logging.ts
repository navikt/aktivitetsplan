import { AktivitetStatus, AktivitetType } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { Lest } from '../../datatypes/lestTypes';
import { Oppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { AKTIVITET_BASE_URL } from '../../environment';
import { hash } from './hash';

interface FrontendEvent {
    name: string;
    fields?: {};
    tags?: {};
}

export default function loggEvent(eventNavn: string, feltObjekt?: object, tagObjekt?: object) {
    const event: FrontendEvent = { name: eventNavn, fields: feltObjekt, tags: tagObjekt };
    const url = `${AKTIVITET_BASE_URL}/logger/event`;
    const config = {
        headers: {
            'Nav-Consumer-Id': 'aktivitetsplan',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin' as const,
        method: 'post',
        body: JSON.stringify(event),
    };
    return fetch(url, config);
}

const FORHANDSORIENTERING_LOGGEVENT = 'aktivitetsplan.forhandsorientering';
const FORHANDSORIENTERING_LOGGEVENT_KRR_KVP_MANUELL = 'avtaltMedNavKrrKvpManuell';
const FORHANDSORIENTERING_LOGGEVENT_MINDRE_ENN_SYV_DAGER = 'avtaltMedNavMindreEnnSyvDager';
const FORHANDSORIENTERING_LOGGEVENT_TILLTAK_SPESIALTILPASSAD = 'tilltakSpesialTilltakBruker';

const MITTMAL_KLIKK_LOGGEVENT = 'aktivitetsplan.mittmal.klikk';
const MITTMAL_LAGRE_LOGGEVENT = 'aktivitetsplan.mittmal.lagre';
const TID_BRUKT_GAINNPA_PLANEN = 'tidbrukt.gainnpa.planen';

const STILLING_FRA_NAV_AAPNE_STILLINGSLENKE = 'aktivitetsplan.stillingfranav.stillingslenke.klikk';

export const LOGGING_ANTALLBRUKERE = 'aktivitetsplan.antallSluttBrukere';
export const ANTALL_VEILEDERE = 'aktivitetsplan.antallVeiledere';
export const LOGG_BRUKER_IKKE_OPPFOLGING = 'aktivitetsplan.antallBrukerIkkeOppfolging';
export const PRINT_MODSAL_OPEN = 'aktivitetsplan.printmodal';
export const TRYK_PRINT = 'aktivitetsplan.printmodalprint';

export const APNE_NY_AKTIVITET = 'aktivitetsplan.nyAktivitet.trykk';
export const APNE_OM_TJENESTEN = 'aktivitetsplan.omTjenesten.trykk';
export const APNE_ENDRE_AKTIVITET = 'aktivitetsplan.endreAktivitet.trykk';
export const OPNE_AKTIVITETFILTER = 'aktivitetsplan.aktivitetfilter.opne';
export const VIS_HISTORISK_PERIODE = 'aktivitetsplan.vis.historisk';
export const LIST_HISTORISK_PERIODE = 'aktivitetsplan.list.historisk';

const filterBase = 'aktivitetsplan.filter.';
export const AKTIVITESTYPE_FILER_METRIKK = `${filterBase}aktivitestype`;
export const STATUS_FILER_METRIKK = `${filterBase}status`;
export const AVTALT_FILER_METRIKK = `${filterBase}avtalt`;
export const ETIKETT_FILTER_METRIKK = `${filterBase}etikett`;
export const ARENA_ETIKETT_FILTER_METRIKK = `${filterBase}arenatEtikett`;

const AKTIVITET_FLYTTET = 'aktivitetsplan.aktivitet.flyttet';

const FORHAANDSORIENTERING_LEST = 'aktivitetsplan.forhaandsorientering.lest';

export function loggForhaandsorienteringLest(aktivitetType: AktivitetType, lestKnappTrykket: boolean) {
    const tag = {
        aktivitetType,
        lestKnappTrykket,
    };

    loggEvent(FORHAANDSORIENTERING_LEST, {}, tag);
}

declare global {
    interface Window {
        aktivitesplanTimeToAktivitestavlePaint?: number;
        defaultSelectedTab?: string;
    }
}

export function logTimeToAktivitestavlePaint(erVeileder: boolean) {
    const rendresForst = !erVeileder || window.defaultSelectedTab === 'AKTIVITETSPLAN';
    if (!window.aktivitesplanTimeToAktivitestavlePaint && rendresForst) {
        const timeToAktivitestavlePaint = performance.now();
        window.aktivitesplanTimeToAktivitestavlePaint = timeToAktivitestavlePaint;
        loggEvent('aktivitetsplan.timeToAktivitestavlePaintv3', { timeToAktivitestavlePaint }, { erVeileder });
    }
}

export function loggAntalVeiledere(servicegruppe: string, underOppfolging: boolean, ident: string, aktorId?: string) {
    const fields = {
        underOppfolging,
        veileder: hash(ident),
        bruker: hash(aktorId),
    };
    loggEvent(ANTALL_VEILEDERE, fields, { servicegruppe });
}

export function loggingAntallBrukere(servicegruppe: string, underOppfolging: boolean, aktorId: string) {
    if (!underOppfolging) {
        loggEvent(LOGG_BRUKER_IKKE_OPPFOLGING, {}, { servicegruppe });
    } else {
        loggEvent(LOGGING_ANTALLBRUKERE, { bruker: hash(aktorId) }, { servicegruppe });
    }
}

export function loggForhandsorienteringTiltak() {
    loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
        forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_TILLTAK_SPESIALTILPASSAD,
    });
}

export function metrikkTidForsteAvtalte(tid: number) {
    loggEvent('aktivitetsplan.aktivitet.forste.avtalt.v2', {
        tidSidenOppfolging: tid,
    });
}

export function flyttetAktivitetMetrikk(flytteMetode: string, aktivitet: VeilarbAktivitet, nyStatus: AktivitetStatus) {
    loggEvent(AKTIVITET_FLYTTET, {
        fraStatus: aktivitet.status,
        tilStatus: nyStatus,
        aktivitetType: aktivitet.type,
        flytteMetode,
    });
}

//TODO: forhandsorienteringType kan endres til enum når gammel kode er slettet
export function loggForhandsorientering(
    erManuellKrrKvpBruker: boolean,
    mindreEnSyvDagerIgen: boolean,
    forhandsorienteringType: string,
    aktivitettype: AktivitetType
) {
    if (erManuellKrrKvpBruker) {
        return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
            forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_KRR_KVP_MANUELL,
            aktivitettype: aktivitettype,
        });
    }

    if (mindreEnSyvDagerIgen) {
        return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
            forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_MINDRE_ENN_SYV_DAGER,
            aktivitettype: aktivitettype,
        });
    }

    return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
        forhandsorienteringType: forhandsorienteringType,
        aktivitettype: aktivitettype,
    });
}

export function loggMittMalKlikk(veileder: boolean) {
    loggEvent(MITTMAL_KLIKK_LOGGEVENT, { erVeileder: veileder });
}

export function loggMittMalLagre(veileder: boolean) {
    loggEvent(MITTMAL_LAGRE_LOGGEVENT, { erVeileder: veileder });
}

export function loggStillingFraNavStillingslenkeKlikk(veileder: boolean) {
    loggEvent(STILLING_FRA_NAV_AAPNE_STILLINGSLENKE, { erVeileder: veileder });
}

function tidBruktFra(fraDato: number | string, tilDato?: number | string) {
    const tilD = tilDato ? new Date(tilDato).getTime() : new Date().getTime();
    return Math.ceil(Math.abs(new Date(fraDato).getTime() - tilD) / (1000 * 3600 * 24));
}

function loggTidBruktFraRegistrert(fraDato: number | string) {
    loggEvent(TID_BRUKT_GAINNPA_PLANEN, {
        tidBruktFraRegistrert: tidBruktFra(fraDato),
    });
}

export function loggTidBruktGaaInnPaaAktivitetsplanen(lest: Lest[], perioder: Oppfolgingsperiode[]) {
    const periode = perioder.find((p) => p.sluttDato === null);
    if (periode) {
        // Tid brukt fra registrert til aktivitetsplanen
        if (lest.length === 0) {
            const startDatoPaaOppfolging = periode.startDato;
            const tidVeilarbLestBleLansert = new Date('2019-02-01').getTime();
            const tidStartOppfolging = new Date(startDatoPaaOppfolging).getTime();
            if (tidVeilarbLestBleLansert < tidStartOppfolging) {
                loggTidBruktFraRegistrert(startDatoPaaOppfolging);
            }
        }
        // Tid brukt mellom gangene i aktivitetsplanen
        if (lest.length !== 0) {
            const lestAktivitetsplan = lest.find((a) => a.ressurs === 'aktivitetsplan');
            if (lestAktivitetsplan) {
                const startDato = new Date(periode.startDato).getTime();
                const tidspunkt = new Date(lestAktivitetsplan.tidspunkt).getTime();
                if (startDato < tidspunkt) {
                    loggEvent(TID_BRUKT_GAINNPA_PLANEN, {
                        tidMellomGangene: tidBruktFra(tidspunkt),
                    });
                } else {
                    loggTidBruktFraRegistrert(startDato);
                }
            }
        }
    }
}
