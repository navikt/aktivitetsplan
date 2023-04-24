import { setupWorker } from 'msw';

import { handlers } from './handlers';

const worker = setupWorker(...handlers);

export default () =>
    worker.start({
        serviceWorker: {
            url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
        onUnhandledRequest: (req, print) => {
            const hostBlacklist = ['amplitude.nav.no', 'nav.psplugin.com'];
            const ignoredFileExtensions = ['.ts', '.js', '.tsx', '.jsx', 'css', 'svg', 'png', '.less'];

            const ignore =
                hostBlacklist.some((route) => req.url.host.includes(route)) ||
                ignoredFileExtensions.some((fileExtension) => req.url.pathname.endsWith(fileExtension));
            if (ignore) {
                return;
            }

            print.warning();
        },
    });
