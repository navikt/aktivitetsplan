import { createBrowserHistory } from 'history';
import { getFodselsnummer } from './bootstrap/fnr-util';
import { CONTEXT_PATH } from '~config'; // eslint-disable-line

const routerHistory = createBrowserHistory({
    basename: CONTEXT_PATH,
});

function prependBasePath(fn) {
    return url => {
        const fodselsnummer = getFodselsnummer();
        return fn.call(
            this,
            (fodselsnummer ? `/${fodselsnummer}` : '') +
                (url.startsWith('/') ? '' : '/') +
                url
        );
    };
}

routerHistory.push = prependBasePath(routerHistory.push);
routerHistory.replace = prependBasePath(routerHistory.replace);

export default routerHistory;
