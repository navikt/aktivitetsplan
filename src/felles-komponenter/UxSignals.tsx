import React, { useEffect } from 'react';

import { ER_PROD, USE_HASH_ROUTER } from '../constant';
import { useErVeileder } from '../Provider';

const UxSignals = () => {
    if (USE_HASH_ROUTER) return null; // ghpages

    const erVeileder = useErVeileder();
    if (erVeileder) return null;

    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js';
        document.body.appendChild(script);

        return () => {
            try {
                document.body.removeChild(script);
            } catch {
                /* empty */
            }
        };
    }, []);

    return (
        <div
            data-uxsignals-embed="study-b6mh8y7gdw"
            data-uxsignals-mode={!ER_PROD ? 'demo' : ''}
            className="max-w-[620px] mx-auto pb-8"
        />
    );
};

export default UxSignals;