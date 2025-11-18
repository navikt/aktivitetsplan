import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';
import { TextCheckerResult } from '@navikt/dab-spraksjekk';
import { AnalyticsEvent } from './analytics-taxonomy-events';

const eventLogger = getAnalyticsInstance('aktivitetsplan');

async function logAnalyticsEvent(event: AnalyticsEvent, extraData?: Record<string, unknown>): Promise<void> {
    try {
        console.log('AnalyticsEvent', event, extraData);
        eventLogger(event.name, { ...('data' in event ? event.data : {}), ...extraData, app: 'aktivitetsplan' });
    } catch (e) {
        console.error(e);
    }
}

export function logKlikkKnapp(tekst: string) {
    return logAnalyticsEvent({
        name: 'knapp klikket',
        data: { tekst: tekst },
    });
}

export function logAccordionAapnet(accordion: string) {
    return logAnalyticsEvent({
        name: 'accordion åpnet',
        data: { tekst: accordion },
    });
}

export function logValgtFilter(filterValgt: string) {
    return logAnalyticsEvent({
        name: 'filtervalg',
        data: { filternavn: filterValgt },
    });
}

export function logToggleSpraksjekkToggle(enabled: boolean) {
    return logAnalyticsEvent({ name: 'toggle', data: { text: 'Slå på klarspråkhjelp', enabled: enabled } });
}

export function logReferatFullfort(analysis: TextCheckerResult, referatPublisert: boolean, spraksjekkEnabled: boolean) {
    const mappedAnalysis = mapSpraksjekkAnalysis(analysis);
    return logAnalyticsEvent(
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
    return logAnalyticsEvent({
        name: 'modal lukket',
        data: { isDirty, aktivitet: aktivitet.toLocaleLowerCase(), modalType, navType },
    });
}

export function loggDyplenkingTilAnnenBruker() {
    return logAnalyticsEvent({ name: 'dyplenking', data: { text: 'Dyplenking til annen bruker' } });
}

type Modify<T, U> = Omit<T, keyof U> & U;
export type TextCheckerAnalyticsAnalysis = Omit<
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

function mapSpraksjekkAnalysis(analysis: TextCheckerResult): TextCheckerAnalyticsAnalysis {
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
