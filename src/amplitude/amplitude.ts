import * as amplitude from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';
import { TextCheckerResult } from '@navikt/dab-spraksjekk';

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

export function logToggleSpraksjekkToggle(enabled: boolean) {
    return logAmplitudeEvent({ name: 'toggle', data: { text: 'Slå på klarspråkhjelp', enabled: enabled } });
}

export function logReferatFullfort(analysis: TextCheckerResult, referatPublisert: boolean, spraksjekkEnabled: boolean) {
    const mappedAnalysis = mapSpraksjekkAnalysis(analysis);

    return logAmplitudeEvent({
        name: 'referat lagret',
        data: { analysis: mappedAnalysis, referatPublisert, spraksjekkEnabled },
    });
}

type Modify<T, U> = Omit<T, keyof U> & U;
export type TextCheckerAmplitudeAnalysis = Omit<
    Modify<
        TextCheckerResult,
        {
            longParagraphs: number;
            longSentences: number;
            longWords: number;
            duplicateWords: number;
            kansellisten: number;
            nrkOrd: number;
            avloeserord: number;
            personalData: {
                emails: number;
                names: number;
                phonenumbers: number;
            };
        }
    >,
    'tools'
> & { tools: Omit<TextCheckerResult['tools'], 'wordFrequency'> };

function mapSpraksjekkAnalysis(analysis: TextCheckerResult): TextCheckerAmplitudeAnalysis {
    return {
        longParagraphs: analysis.longParagraphs.length,
        longSentences: analysis.longSentences.length,
        longWords: analysis.longWords.length,
        duplicateWords: analysis.duplicateWords.length,
        kansellisten: analysis.kansellisten.length,
        nrkOrd: analysis.nrkOrd.length,
        avloeserord: analysis.avloeserord.avloeserordMatches.length + analysis.avloeserord.datatermerMatches.length,
        comma: analysis.comma,
        personalData: {
            emails: analysis.personalData.emails.length,
            names: analysis.personalData.names.length,
            phonenumbers: analysis.personalData.phonenumbers.length,
        },
        tools: { lix: analysis.tools.lix, wordCount: analysis.tools.wordCount },
    };
}
