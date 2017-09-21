import { CONTEXT_PATH } from '~config'; // eslint-disable-line

// eslint-disable-next-line import/prefer-default-export
export const getFodselsnummer = () => {
    const fnrMatch = window.location.pathname.match(`${CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
};
