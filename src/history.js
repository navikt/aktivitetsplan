import { createBrowserHistory } from 'history';

export default function createHistory(contextPath) {
    const routerHistory = createBrowserHistory({
        basename: contextPath
    });
    return routerHistory;
}
