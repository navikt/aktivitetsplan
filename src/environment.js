function getEnviromentVariable(variableName, ignoreIfMissing) {
    const value =
        window.aktivitetsplan[variableName] ||
        window.aktivitetsplan[variableName.toLowerCase()];

    if (!value && !ignoreIfMissing) {
        throw new Error(`Mangler: ${variableName}`);
    }

    return value;
}

export const DIALOG_BASE_URL = getEnviromentVariable('VEILARBDIALOG_URL');

export const AKTIVITET_BASE_URL = getEnviromentVariable('VEILARBAKTIVITET_URL');

export const OPPFOLGING_BASE_URL = getEnviromentVariable(
    'VEILARBOPPFOLGING_URL'
);

export const ONBOARDING_VIDEO_URL = getEnviromentVariable(
    'ONBOARDING_VIDEO_URL'
);

export const OPPGAVE_BASE_URL = getEnviromentVariable(
    'VEILARBOPPGAVE_URL',
    true
);

export const PERSON_BASE_URL = getEnviromentVariable('VEILARBPERSON_URL', true);

export const PORTEFOLJE_BASE_URL = getEnviromentVariable(
    'VEILARBPORTEFOLJE_URL',
    true
);

export const VEILEDER_BASE_URL = getEnviromentVariable(
    'VEILARBVEILEDER_URL',
    true
);

export const FEATURE_BASE_URL = getEnviromentVariable(
    'FEATURE_ENDPOINT_URL',
    true
);

export default {};
