import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { CONTEXT_PATH, getDynamicBasePath } from '~config'; // eslint-disable-line

const routerHistory = useRouterHistory(createHistory)({
    basename: CONTEXT_PATH
});

const originalPush = routerHistory.push;
function pushWithDynamicBasePath(url) {
    return originalPush.call(this, (getDynamicBasePath() || '') + (url.startsWith('/') ? '' : '/') + url);
}
routerHistory.push = pushWithDynamicBasePath;

export default routerHistory;
