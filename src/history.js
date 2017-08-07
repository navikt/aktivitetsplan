import { createBrowserHistory } from 'history';
import { getFodselsnummer } from './bootstrap/fnr-util';
import { CONTEXT_PATH } from '~config'; // eslint-disable-line

const routerHistory = createBrowserHistory({
    basename: CONTEXT_PATH,
});

function prependBasePath(fn) {
    return url => {
        const fodselsnummer = getFodselsnummer();
        const path = url.pathname ? url.pathname : url;
        const urlParams = url.urlParams ? url.urlParams : null;
        return fn.call(this, {
            pathname:
                (fodselsnummer ? `/${fodselsnummer}` : '') +
                (path.startsWith('/') ? '' : '/') +
                path,
            search: urlParams,
        });
    };
}

routerHistory.push = prependBasePath(routerHistory.push);
routerHistory.replace = prependBasePath(routerHistory.replace);

export default routerHistory;
