// eslint-disable-next-line import/prefer-default-export
export const getFodselsnummer = () => {
    const fnrMatch = window.location.pathname.match(`${window.appconfig.CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
};
