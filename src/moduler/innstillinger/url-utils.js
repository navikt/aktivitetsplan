import { erITestMiljo, finnMiljoStreng, finnNaisDomene } from './miljo-utils';

function byggRegistreringUrl(fnr, enhet) {
    return `https://arbeidssokerregistrering-fss${finnMiljoStreng()}${finnNaisDomene()}?fnr=${fnr}&enhetId=${enhet}`;
}

function byggRegistreringMedVeilarbLoginUrl(fnr, enhet) {
    return `https://veilarblogin${finnMiljoStreng()}${finnNaisDomene()}veilarblogin/api/start?url=${encodeURIComponent(
        byggRegistreringUrl(fnr, enhet)
    )}`;
}

// eslint-disable-next-line import/prefer-default-export
export function lagRegistreringUrl(fnr, enhetId) {
    return erITestMiljo()
        ? byggRegistreringMedVeilarbLoginUrl(fnr, enhetId)
        : byggRegistreringUrl(fnr, enhetId);
}
