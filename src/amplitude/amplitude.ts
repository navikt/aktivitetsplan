import * as amplitude from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';

import { AmplitudeEvent } from './taxonomy-events';

export function initAmplitude() {
    const apiKey = import.meta.env.VITE_AMPLITUDE_KEY ?? 'default';

    amplitude.init(apiKey, undefined, {
        serverUrl: import.meta.env.VITE_AMPLITUDE_API_URL,
        ingestionMetadata: {
            sourceName: window.location.toString(),
        },
    });
}

async function logAmplitudeEvent(event: AmplitudeEvent, extraData?: Record<string, unknown>): Promise<void> {
    try {
        track(event.name, { ...('data' in event ? event.data : {}), ...extraData });
    } catch (e) {
        console.error(e);
    }
}
