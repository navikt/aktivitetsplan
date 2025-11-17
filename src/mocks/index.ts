import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';

const worker = setupWorker(...handlers);

export default () =>
    worker.start({
        serviceWorker: {
            url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
        onUnhandledRequest: (req, print) => {
            const hostBlacklist = ['nav.psplugin.com', 'dekoratoren.ekstern.dev.nav.no'];
            const ignoredFileExtensions = ['.ts', '.js', '.tsx', '.jsx', 'css', 'svg', 'png', '.less'];

            const url = new URL(req.url);

            const ignore =
                hostBlacklist.some((route) => url.host.includes(route)) ||
                ignoredFileExtensions.some((fileExtension) => url.pathname.endsWith(fileExtension));
            if (ignore) {
                return;
            }

            print.warning();
        },
    });

injectDecoratorClientSide({
    env: 'dev',
    params: {
        simple: false,
        chatbot: true,
    },
});
