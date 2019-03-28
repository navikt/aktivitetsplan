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
    const brukerHarIkkeSendtDialogTidligere =
        dialoger.filter(
            d =>
                d.henvendelser.filter(h => h.avsender === 'BRUKER').length !== 0
        ).length === 0;

    if (brukerHarIkkeSendtDialogTidligere) {
        const periode = oppfolgingsPerioder.filter(p => p.sluttDato === null);
        if (periode.length > 0) {
            const startDatoPaaOppfolging =
                periode.length > 0 && periode[0].startDato;
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
