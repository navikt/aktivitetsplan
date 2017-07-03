import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { getFodselsnummer } from './bootstrap/fnr-util';
import { CONTEXT_PATH } from '~config'; // eslint-disable-line

const routerHistory = useRouterHistory(createHistory)({
    basename: CONTEXT_PATH,
});

const originalPush = routerHistory.push;
function pushWithDynamicBasePath(url) {
    const fodselsnummer = getFodselsnummer();
    return originalPush.call(
        this,
        (fodselsnummer ? `/${fodselsnummer}` : '') +
            (url.startsWith('/') ? '' : '/') +
            url
    );
}
routerHistory.push = pushWithDynamicBasePath;

export default routerHistory;
