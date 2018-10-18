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
