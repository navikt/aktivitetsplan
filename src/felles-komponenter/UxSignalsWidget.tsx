import React, { useEffect } from 'react';

import { ER_PROD, USE_HASH_ROUTER } from '../constant';
import { useErVeileder } from '../Provider';

const UxSignalsWidget = () => {
    const erVeileder = useErVeileder();
    const isDesktopOnRender = window.innerWidth >= 992;
    const showUxSignalsWidget = !erVeileder && !USE_HASH_ROUTER && ER_PROD && isDesktopOnRender;

    useEffect(() => {
        if (showUxSignalsWidget) {
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
        }
    }, [showUxSignalsWidget]);

    if (!showUxSignalsWidget) return null;

    return <div data-uxsignals-embed="panel-838jxh69e" data-uxsignals-mode="demo" className="uxsignalswidget max-w-[620px] mx-auto pb-8" />;
};

export default UxSignalsWidget;
