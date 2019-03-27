// Denne filen skal kun brukes i FSS
// TODO: Når veilederverktøy-modalen flyttes, skal denne filen fjernes

export const NAIS_PREPROD_SUFFIX = 'preprod.local/';
export const NAIS_PROD_SUFFIX = 'adeo.no/';

export function finnMiljoStreng() {
    const host = window.location.host;
    const bindestrekIndex = host.indexOf('-');
    if (bindestrekIndex === -1) {
        return '';
    }
    const dotIndex = host.indexOf('.');
    return host.substring(bindestrekIndex, dotIndex);
}

export function finnNaisMiljoStreng() {
    const host = window.location.host;
    const isProd = !host.includes('-');
    if (isProd) {
        return NAIS_PROD_SUFFIX;
    }
    return NAIS_PREPROD_SUFFIX;
}

export function finnNaisDomene() {
    return `.nais.${finnNaisMiljoStreng()}`;
}

export function erITestMiljo() {
    return window.location.hostname.indexOf('-q') >= 0;
}
