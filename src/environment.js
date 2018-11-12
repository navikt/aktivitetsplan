import '@webcomponents/url';

function getEnviromentVariable(
    variableName,
    ignoreIfMissing = false,
    stripDomain = false
) {
    const value =
        window.aktivitetsplan[variableName] ||
        window.aktivitetsplan[variableName.toLowerCase()];

    if (!value && !ignoreIfMissing) {
        throw new Error(`Mangler: ${variableName}`);
    }

    if (stripDomain && value) {
        const url = new URL(value);
        return `${url.pathname}${url.search}`;
    }

    return value;
}

const hostname = window.location.hostname;
const gamleApier =
    hostname === 'tjenester.nav.no' || hostname === 'tjenester-q0.nav.no';

export const DIALOG_BASE_URL = gamleApier
    ? '/veilarbdialogproxy/api'
    : '/veilarbdialog/api';
export const AKTIVITET_BASE_URL = gamleApier
    ? '/veilarbaktivitetproxy/api'
    : '/veilarbaktivitet/api';
export const OPPFOLGING_BASE_URL = gamleApier
    ? '/veilarboppfolgingproxy/api'
    : '/veilarboppfolging/api';

export const ONBOARDING_VIDEO_URL = getEnviromentVariable(
    'ONBOARDING_VIDEO_URL'
);

export const OPPGAVE_BASE_URL = getEnviromentVariable(
    'VEILARBOPPGAVE_URL',
    true,
    true
);

export const PERSON_BASE_URL = getEnviromentVariable(
    'VEILARBPERSON_URL',
    true,
    true
);

export const PORTEFOLJE_BASE_URL = getEnviromentVariable(
    'VEILARBPORTEFOLJE_URL',
    true,
    true
);

export const VEILEDER_BASE_URL = getEnviromentVariable(
    'VEILARBVEILEDER_URL',
    true,
    true
);

export const MALVERK_BASE_URL = getEnviromentVariable(
    'VEILARBMALVERK_URL',
    true,
    true
);

export default {};
