function getEnviromentVariable(variableName) {
    const value = window.aktivitetsplan[variableName];

    if (!value) {
        throw new Error(`Mangler: ${variableName}`);
    }

    return value;
}

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

export default {};
