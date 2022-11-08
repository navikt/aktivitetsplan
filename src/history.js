import { createBrowserHistory } from 'history';

import { hentFnrFraUrl } from './utils/fnr-util';

function nyURLHarQueryString(url) {
    return url.indexOf('?') !== -1;
}

function prependBasePath(fn) {
    return (urlObj) => {
        const url = typeof urlObj === 'object' ? urlObj.pathname : urlObj;
        const fodselsnummer = hentFnrFraUrl();
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

export default function createHistory(contextPath) {
    const routerHistory = createBrowserHistory({
        basename: contextPath
    });

    routerHistory.push = prependBasePath(routerHistory.push);
    routerHistory.replace = prependBasePath(routerHistory.replace);
    return routerHistory;
}
