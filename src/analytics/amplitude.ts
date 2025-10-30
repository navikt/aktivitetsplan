import * as amplitude from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';
import { TextCheckerResult } from '@navikt/dab-spraksjekk';

import { AmplitudeEvent } from './taxonomy-events';

export function initAmplitude() {
    const apiKey = import.meta.env.VITE_AMPLITUDE_KEY ?? 'default';

    amplitude.init(apiKey, undefined, {
        defaultTracking: true,
        serverUrl: import.meta.env.VITE_AMPLITUDE_API_URL,
        ingestionMetadata: {
            sourceName: window.location.toString(),
        },
    });
}

async function logAmplitudeEvent(event: AmplitudeEvent, extraData?: Record<string, unknown>): Promise<void> {
    try {
        track(event.name, { ...('data' in event ? event.data : {}), ...extraData, app: 'aktivitetsplan' });
    } catch (e) {
        console.error(e);
    }
}

export function logKlikkKnapp(tekst: string) {
    return logAmplitudeEvent({
        name: 'knapp klikket',
        data: { tekst: tekst },
    });
}

export function logAccordionAapnet(accordion: string) {
    return logAmplitudeEvent({
        name: 'accordion åpnet',
        data: { tekst: accordion },
    });
}

export function logValgtFilter(filterValgt: string) {
    return logAmplitudeEvent({
        name: 'filtervalg',
        data: { filternavn: filterValgt },
    });
}

export function logToggleSpraksjekkToggle(enabled: boolean) {
    return logAmplitudeEvent({ name: 'toggle', data: { text: 'Slå på klarspråkhjelp', enabled: enabled } });
}

export function logReferatFullfort(analysis: TextCheckerResult, referatPublisert: boolean, spraksjekkEnabled: boolean) {
    const mappedAnalysis = mapSpraksjekkAnalysis(analysis);
    return logAmplitudeEvent(
        {
            name: 'referat lagret',
            data: { analysis: mappedAnalysis, referatPublisert, spraksjekkEnabled },
        },
        { variant: 'D' },
    );
}

export function logModalLukket({
    isDirty,
    aktivitet,
    modalType,
    navType,
}: {
    isDirty: boolean;
    aktivitet: string;
    modalType: 'ny-aktivitet' | 'endre-aktivitet';
    navType: 'onReqClose' | 'onReqBack';
}) {
    return logAmplitudeEvent({
        name: 'modal lukket',
        data: { isDirty, aktivitet: aktivitet.toLocaleLowerCase(), modalType, navType },
    });
}

export function loggDyplenkingTilAnnenBruker() {
    return logAmplitudeEvent({ name: 'dyplenking', data: { text: 'Dyplenking til annen bruker' } });
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
            personvernbrudd: number;
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
        personvernbrudd: analysis.personvernbrudd.length,
        personalData: {
            emails: analysis.personalData.emails.length,
            names: analysis.personalData.names.length,
            phonenumbers: analysis.personalData.phonenumbers.length,
        },
        tools: { lix: analysis.tools.lix, wordCount: analysis.tools.wordCount },
    };
}
