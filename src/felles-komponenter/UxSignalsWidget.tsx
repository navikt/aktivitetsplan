import React, { useEffect } from 'react';

import { ER_PROD } from '../constant';

const UxSignalsWidget = () => {
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
            className="uxsignalswidget max-w-[620px] mx-auto pb-8"
        />
    );
};

export default UxSignalsWidget;
