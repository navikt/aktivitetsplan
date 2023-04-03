import React, { ReactNode, useEffect } from 'react';

import { hentFeature } from './felles-komponenter/feature/feature-reducer';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';

function getEnhetFromURL() {
    const queryString = window.location.search;
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    const maybeEnhet = pairs.find((val) => val.startsWith('enhet='));
    if (maybeEnhet) {
        const enhet = maybeEnhet.substring(6);
        return enhet === '' ? undefined : enhet;
    }

    return undefined;
}

const InitiellDataLast = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentFeature(getEnhetFromURL()));
    }, []);

    return <>{children}</>;
};

export default InitiellDataLast;
