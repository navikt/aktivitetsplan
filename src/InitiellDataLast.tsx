import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import { hentFeature } from './felles-komponenter/feature/feature-reducer';

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
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentFeature(getEnhetFromURL()) as unknown as AnyAction);
    }, []);

    return <>{children}</>;
};

export default InitiellDataLast;
