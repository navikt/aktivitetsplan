import { setupWorker } from 'msw';

import { handlers } from './handlers';

const worker = setupWorker(...handlers);

export default () =>
    worker.start({
        // for msw to work on gh pages
        serviceWorker: {
            url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
        onUnhandledRequest: (req, print) => {
            const unhandled = ['/favicon.ico', '/manifest.json', '/src'].some((route) =>
                req.url.pathname.includes(route)
            );

            if (unhandled) {
                return;
            }

            print.warning();
        },
    });
