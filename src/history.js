import { createBrowserHistory } from 'history';
import { getFodselsnummer } from './bootstrap/fnr-util';

function nyURLHarQueryString(url) {
    return url.indexOf('?') !== -1;
}

function prependBasePath(fn) {
    return (urlObj) => {
        const url = typeof urlObj === 'object' ? urlObj.pathname : urlObj;
        const fodselsnummer = getFodselsnummer();
        const urlParams = nyURLHarQueryString(url) ? '' : window.location.search;
        const fodselsnummerPath = `/${fodselsnummer}`;
        return fn.call(this, {
            pathname:
                (fodselsnummer && !url.startsWith(fodselsnummerPath) ? fodselsnummerPath : '') +
                (url.startsWith('/') ? '' : '/') +
                url,
            search: urlParams,
        });
    };
}

export default function createHistory() {
    const routerHistory = createBrowserHistory({
        basename: window.appconfig.CONTEXT_PATH,
    });

    routerHistory.push = prependBasePath(routerHistory.push);
    routerHistory.replace = prependBasePath(routerHistory.replace);
    return routerHistory;
}
