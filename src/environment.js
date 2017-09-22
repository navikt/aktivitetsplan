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
export const AKTIVITET_PROXY_BASE_URL = getEnviromentVariable(
    'veilarbaktivitet_url'
);
export const SITUASJON_PROXY_BASE_URL = getEnviromentVariable(
    'veilarbsituasjon_url'
);
export const ONBOARDING_VIDEO_URL = getEnviromentVariable(
    'onboarding_video_url'
);

export const OPPGAVE_BASE_URL =
    sone === FSS ? getEnviromentVariable('veilarboppgave_url') : null;

export default {};
