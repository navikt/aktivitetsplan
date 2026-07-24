import { getEnv } from './environment';
import { init } from '@nais/apm';

init({
    app: 'aktivitetsplan',
    namespace: 'dab',
    environment: getEnv(),
    // Don't check if version is automatically resolved before enabling or removing
    // version: import.meta.env.VITE_RELEASE,
    ignoreErrors: [
        /Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.$/,
        // The above seems to not be working :(
        /The node to be removed is not a child of this node\.$/,
        /Failed to fetch content for main-menu/,
        /Callback error while fetching value for key privatperson_nb/,
        /^NotFoundError: The object can not be found here.$/,
        /Failed to fetch auth data\./,
    ],
    tracing: true,
    sessionReplay: { enabled: false },
    screenshotOnError: false,
});
