import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import {CONTEXT_PATH, getDynamicBasePath} from '~config';

const routerHistory = useRouterHistory(createHistory)({
    basename: CONTEXT_PATH
});

const originalPush = routerHistory.push;
routerHistory.push = function (url) {
    return originalPush.call(this, (getDynamicBasePath() || "") + (url.startsWith("/") ? "" : "/") + url);
};

export default routerHistory;
