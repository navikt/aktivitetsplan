// Generator function to process events from the queue
import { EventDataValue, TrackingFunction } from './initAnalytics';

const timeoutMs = 5000;
const umamiLoadedPromise: Promise<void> = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
        reject(`Did not find/load umami after ${timeoutMs}ms`);
    }, timeoutMs);
    const umamiScript = document.getElementById('umami-script');
    if (!umamiScript) reject('No umami script found id=umami-script');
    umamiScript?.addEventListener('load', () => {
        clearTimeout(timeout);
        resolve();
    });
});

declare global {
    interface Window {
        umami: {
            track: (
                eventName: string,
                data: {
                    origin: string;
                    eventName: string;
                    eventData: Record<string, EventDataValue>;
                },
            ) => Promise<void>;
        } | null;
    }
}

export const umamiTrack: TrackingFunction = (eventName, eventData) => {
    if (typeof window === 'undefined') {
        console.warn('[umamiTrack] Window is undefined (SSR context)');
        return;
    }

    if (!window.umami) {
        console.warn('[umamiTrack] window.umami is not available yet. Waiting for script to load...', {
            eventName,
            eventData,
        });

        // Wait for Umami to load, then retry
        umamiLoadedPromise
            .then(() => {
                console.log('[umamiTrack] Umami now available, tracking event:', eventName, eventData);
                window.umami!.track(eventName, eventData);
            })
            .catch(() => {
                console.error('[umamiTrack] Umami script failed to load within timeout. Event not tracked:', {
                    eventName,
                    eventData,
                });
            });
        return;
    }

    console.log('[umamiTrack] Tracking event:', eventName, eventData);
    window.umami.track(eventName, eventData);
};
