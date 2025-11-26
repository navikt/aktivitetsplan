import { Env, getEnv } from '../environment';
import { ER_INTERN_FLATE } from '../constant';

export type EventDataValue = string | boolean | number | null | undefined;
export type EventData = Record<string, EventDataValue>;
export type TrackingFunction = (eventName: string, eventData: EventData) => void;
let trackingFunction: TrackingFunction = (name, data) => {};
let isInitialized = false;

declare global {
    interface Window {
        dekoratorenAnalytics: (arg: {
            origin: string;
            eventName: string;
            eventData: Record<string, EventDataValue>;
        }) => Promise<void>;
    }
}

const env = getEnv();
export const initAnalytics = () => {
    if (env == Env.Local) {
        trackingFunction = (eventName, eventData) => {
            console.log('[AnalyticsEvent]', eventName, eventData);
        };
        isInitialized = true;
        flushEventQueue(trackingFunction);
        return;
    }
    if (!ER_INTERN_FLATE) {
        /* window.dekoratorenAnalytics does not return a function instantly, have to wait for it to be ready */
        setTimeout(() => {
            const dekoratorenTracking = window.dekoratorenAnalytics;
            trackingFunction = (eventName, eventData) => {
                dekoratorenTracking({ origin: 'aktivitetsplan', eventName, eventData });
            };
            isInitialized = true;
            flushEventQueue(trackingFunction);
        }, 1000);
    } else {
        /* Use umami from included <script> tag */
        import('./umamiFromScript').then((module) => {
            trackingFunction = (eventName, eventData) => {
                // Dette er riktig ifølge umami doc
                module.umamiTrack(eventName, { ...eventData, origin: 'aktivitetsplan' });
            };
            isInitialized = true;
            flushEventQueue(trackingFunction);
        });
    }
};

type QueuedEvent = {
    eventName: string;
    eventData: EventData;
};
let eventQueue: QueuedEvent[] = [];

// Generator function to process events from the queue
function* eventQueueProcessor(): Generator<QueuedEvent, void, void> {
    while (eventQueue.length > 0) {
        const event = eventQueue.shift();
        if (event) {
            yield event;
        }
    }
}

// Process all queued events once tracking is initialized
export const flushEventQueue = (trackingFunction: TrackingFunction) => {
    const processor = eventQueueProcessor();
    processor.next();
    let result: IteratorResult<QueuedEvent> = processor.next();
    while (!result.done) {
        trackingFunction(result.value.eventName, result.value.eventData);
        result = processor.next();
    }
};

// Queue or immediately track events
export const queueOrTrackEvent = (eventName: string, eventData: EventData) => {
    if (isInitialized) {
        trackingFunction(eventName, eventData);
    } else {
        console.warn(`[AnalyticsEvent] - analytics not ready yet, queueing event <${eventName}>`);
        eventQueue.push({ eventName, eventData });
    }
};
