import { CONTEXT_PATH } from '~config'; // eslint-disable-line
import queryString from 'query-string';

// eslint-disable-next-line import/prefer-default-export
export const getFodselsnummer = () => {
    const fnrMatch = window.location.pathname.match(`${CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
};

export const getEnhetFromUrl = () => queryString.parse(location.search).enhet;
