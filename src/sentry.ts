import { getEnv } from './environment';
import { init } from '@nais/apm';

init({
    app: 'aktivitetsplan',
    namespace: 'dab',
    environment: getEnv(),
    version: import.meta.env.VITE_RELEASE,
    ignoreErrors: [
        /^Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.$/,
        /^Uventet feil fra dekoratøren: NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node. \[object Object]$/,
        /^Uventet feil fra dekoratøren: NotFoundError: The object can not be found here. \[object Object]$/,
        /^The object can not be found here.$/,
    ],
    sessionReplay: { enabled: false },
    screenshotOnError: false,
});
