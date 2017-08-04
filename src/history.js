import { createBrowserHistory } from 'history';
import { getFodselsnummer } from './bootstrap/fnr-util';
import { CONTEXT_PATH } from '~config'; // eslint-disable-line

const routerHistory = createBrowserHistory({
    basename: CONTEXT_PATH,
});

function prependBasePath(fn) {
    return url => {
        let path = '';
        let search = '';

        if (!(typeof url === 'string')) {
            path = url.pathname;
            search = url.search;
        } else {
            path = url;
        }
        const fodselsnummer = getFodselsnummer();
        return fn.call(
            this,
            (fodselsnummer ? `/${fodselsnummer}` : '') +
            (path.startsWith('/') ? '' : '/') +
            path + search
        );
    };
}

routerHistory.push = prependBasePath(routerHistory.push);
routerHistory.replace = prependBasePath(routerHistory.replace);

export default routerHistory;
