const FSS = 'FSS';

function getEnviromentVariable(variableName) {
    const value = window.aktivitetsplan[variableName];

    if (!value) {
        throw new Error(`Mangler: ${variableName}`);
    }

    return value;
}

const sone = getEnviromentVariable('sone');

export const DIALOG_BASE_URL = getEnviromentVariable('veilarbdialog_url');

export const AKTIVITET_BASE_URL = getEnviromentVariable('veilarbaktivitet_url');

export const OPPFOLGING_BASE_URL = getEnviromentVariable(
    'veilarboppfolging_url'
);

export const ONBOARDING_VIDEO_URL = getEnviromentVariable(
    'onboarding_video_url'
);

export const OPPGAVE_BASE_URL =
    sone === FSS ? getEnviromentVariable('veilarboppgave_url') : null;

export const PERSON_BASE_URL =
    sone === FSS ? getEnviromentVariable('veilarbperson_url') : null;

export const PORTEFOLJE_BASE_URL =
    sone === FSS ? getEnviromentVariable('veilarbportefolje_url') : null;

export const VEILEDER_BASE_URL =
    sone === FSS ? getEnviromentVariable('veilarbveileder_url') : null;

export const FEATURE_BASE_URL =
    sone === FSS ? getEnviromentVariable('feature_endpoint_url') : null;

export default {};
