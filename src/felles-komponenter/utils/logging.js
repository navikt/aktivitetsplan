export default function loggEvent(eventNavn, feltObjekt, tagObjekt) {
    const frontendlogger = window.frontendlogger;
    if (frontendlogger) {
        frontendlogger.event(eventNavn, feltObjekt || {}, tagObjekt || {});
    }
}

const FORHANDSORIENTERING_LOGGEVENT = 'aktivitetsplan.forhandsorientering';
const FORHANDSORIENTERING_LOGGEVENT_KRR_KVP_MANUELL =
    'avtaltMedNavKrrKvpManuell';
const FORHANDSORIENTERING_LOGGEVENT_MINDRE_ENN_SYV_DAGER =
    'avtaltMedNavMindreEnnSyvDager';
const FORHANDSORIENTERING_LOGGEVENT_TILLTAK_SPESIALTILPASSAD =
    'tilltakSpesialTilltakBruker';

const MITTMAL_KLIKK_LOGGEVENT = 'aktivitetsplan.mittmal.klikk';
const MITTMAL_LAGRE_LOGGEVENT = 'aktivitetsplan.mittmal.lagre';
const PRINT_MODSAL_OPEN = 'aktivitetsplan.printmodal';
const TRYK_PRINT = 'aktivitetsplan.printmodalprint';
const DAILOG_BRUKER_HENVENDELSE = 'dialog.bruker.henvendelse';
const TID_BRUKT_GAINNPA_PLANEN = 'tidbrukt.gainnpa.planen';

export function metrikkOpnePrintModal(veileder) {
    loggEvent(PRINT_MODSAL_OPEN, { erVeileder: veileder });
}

export function metrikkTrykkPrintKnapp(veileder) {
    loggEvent(TRYK_PRINT, { erVeileder: veileder });
}

export function loggForhandsorienteringTiltak() {
    loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
        forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_TILLTAK_SPESIALTILPASSAD,
    });
}

export function loggForhandsorientering(
    erManuellKrrKvpBruker,
    mindreEnSyvDagerIgen,
    avtaltForm
) {
    if (erManuellKrrKvpBruker) {
        return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
            forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_KRR_KVP_MANUELL,
        });
    }

    if (mindreEnSyvDagerIgen) {
        return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
            forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_MINDRE_ENN_SYV_DAGER,
        });
    }

    return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
        forhandsorienteringType: avtaltForm,
    });
}

export function loggMittMalKlikk(veileder) {
    loggEvent(MITTMAL_KLIKK_LOGGEVENT, { erVeileder: veileder });
}

export function loggMittMalLagre(veileder) {
    loggEvent(MITTMAL_LAGRE_LOGGEVENT, { erVeileder: veileder });
}

export function loggTidBruktForsteHenvendelse(dialoger, oppfolgingsPerioder) {
    const brukerHarSendtDialogTidligere = dialoger.find(a =>
        a.henvendelser.find(h => h.avsender === 'BRUKER')
    );

    if (!brukerHarSendtDialogTidligere) {
        const periode = oppfolgingsPerioder.filter(p => p.sluttDato === null);
        if (periode.length > 0) {
            const startDatoPaaOppfolging = periode[0].startDato;
            const tidBruktForsteHenvendelse = Math.ceil(
                Math.abs(
                    new Date(startDatoPaaOppfolging).getTime() -
                        new Date().getTime()
                ) /
                    (1000 * 3600 * 24)
            );
            loggEvent(DAILOG_BRUKER_HENVENDELSE, {
                tidBruktForsteHenvendelse,
            });
        }
    }
}

function tidBruktFra(fraDato, tilDato) {
    const tilD = tilDato ? new Date(tilDato).getTime() : new Date().getTime();
    return Math.ceil(
        Math.abs(new Date(fraDato).getTime() - tilD) / (1000 * 3600 * 24)
    );
}

export function loggTidBruktGaaInnPaaAktivitetsplanen(lest, perioder) {
    const periode = perioder.find(p => p.sluttDato === null);
    if (periode) {
        // Tid brukt fra registrert til aktivitetsplanen
        if (lest.length === 0) {
            const startDatoPaaOppfolging = periode.startDato;
            loggEvent(TID_BRUKT_GAINNPA_PLANEN, {
                tidBruktFraRegistrert: tidBruktFra(startDatoPaaOppfolging),
            });
        }
        // Tid brukt mellom gangene i aktivitetsplanen
        if (lest.length !== 0) {
            const lestAktivitetsplan = lest.find(
                a => a.ressurs === 'aktivitetsplan'
            );
            const startDato = new Date(periode.startDato).getTime();
            const tidspunkt = new Date(lestAktivitetsplan.tidspunkt).getTime();
            if (startDato < tidspunkt) {
                loggEvent(TID_BRUKT_GAINNPA_PLANEN, {
                    tidMellomGangene: tidBruktFra(tidspunkt),
                });
            }
        }
    }
}
