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
