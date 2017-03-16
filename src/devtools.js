import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import { erDev } from './utils';

let DevTools;// eslint-disable-line import/no-mutable-exports
if (erDev()) {
    DevTools = createDevTools(
        <DockMonitor
            toggleVisibilityKey="ctrl-y"
            changePositionKey="ctrl-q"
            fluid={false}
            defaultSize={300}
            defaultIsVisible={false}
        >
            <LogMonitor theme="nicinabox" />
        </DockMonitor>
    );

    console.log('Kjører i dev-modus, trykk ctrl+y for å åpne DevTools');// eslint-disable-line no-console
} else {
    DevTools = () => null;
}

export default DevTools;
