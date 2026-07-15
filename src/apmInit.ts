import { getEnv } from './environment';
import { init } from '@nais/apm';

init({
    app: 'aktivitetsplan',
    namespace: 'dab',
    environment: getEnv(),
    // Don't check if version is automatically resolved before enabling or removing
    // version: import.meta.env.VITE_RELEASE,
    ignoreErrors: [
        /^Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.$/,
        /^Uventet feil fra dekoratøren: NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node. \[object Object]$/,
        /^Uventet feil fra dekoratøren: NotFoundError: The object can not be found here. \[object Object]$/,
        /^The object can not be found here.$/,
    ],
    tracing: true,
    sessionReplay: { enabled: false },
    screenshotOnError: false,
});
