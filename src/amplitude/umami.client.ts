// umami.client.ts
import { EnvType, getEnv } from "~/util/envUtil";
import { TextCheckerResult } from "@navikt/dab-spraksjekk";
import { Env } from '../environment';

declare global {
    interface Window {
        umami?: {
            track: (eventName: string, data?: Record<string, any>) => void;
        };
    }
}

const env = getEnv();

enum SiteType {
    INTERN = "intern",
    EKSTERN = "ekstern",
}

function getSiteType(): SiteType {
    const host = window.location.host;
    if (host.includes("veilarbpersonflate.intern")) return SiteType.INTERN;
    return SiteType.EKSTERN;
}

function getUmamiWebsiteId(): string {
    const host = window.location.host;
    const env = getEnv();

    if (env === Env.Prod) {
        if (host.includes("veilarbpersonflate.intern.nav.no")) return "4d815e07-ee57-47ca-bc1f-bc1c89fe5c60";
        if (host.includes("aktivitetsplan.nav.no")) return "d0a61c11-70da-4631-be66-6bc1316234d3";
    }

    if (env === Env.Dev) {
        if (host.includes("veilarbpersonflate.intern.dev.nav.no")) return "da0bf0eb-471b-474f-96d3-fabd11912165";
        if (host.includes("aktivitetsplan.ekstern.dev.nav.no")) return "bd001fd0-7685-4086-b9ee-beeccdbd6b99";
    }

    return ""; // Local eller ukjent host
}

const websiteId = getUmamiWebsiteId();

type TextCheckerAmplitudeAnalysis = Omit<TextCheckerResult, "tools"> & {
    tools: Omit<TextCheckerResult["tools"], "wordFrequency">;
};

export async function loadUmami(): Promise<void> {
    if (!websiteId || window.umami) {
        console.warn("Umami ikke lastet, ukjent host eller lokal environment:", window.location.host);
        return; // ikke last script
    }

    await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.defer = true;
        script.src = "https://cdn.nav.no/team-researchops/sporing/sporing.js";
        script.setAttribute("data-host-url", "https://umami.nav.no");
        script.setAttribute("data-website-id", websiteId);

        script.onload = () => (window.umami ? resolve() : reject(new Error("Umami ikke tilgjengelig")));
        script.onerror = () => reject(new Error("Feil ved lasting av Umami script"));

        document.head.appendChild(script);
    });
}

async function logUmamiEvent(eventName: string, data?: Record<string, any>): Promise<void> {
    if (env.type === EnvType.local) {
        console.log("Umami localhost event:", eventName, data);
        return;
    }
    try {
        window.umami?.track(eventName, { ...data, app: "aktivitetsplan", siteType: getSiteType() });
    } catch (e) {
        console.warn("Feil ved Umami tracking:", e);
    }
}

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
        tools: {
            lix: analysis.tools.lix,
            wordCount: analysis.tools.wordCount,
        },
    };
}

export function logKlikkKnapp(tekst: string) {
    return logUmamiEvent("knapp klikket", { tekst });
}

export function logAccordionAapnet(accordion: string) {
    return logUmamiEvent("accordion åpnet", { tekst: accordion });
}

export function logValgtFilter(filterValgt: string) {
    return logUmamiEvent("filtervalg", { filternavn: filterValgt });
}

export function logToggleSpraksjekkToggle(enabled: boolean) {
    return logUmamiEvent("toggle", { text: "Slå på klarspråkhjelp", enabled });
}

export function logReferatFullfort(
    analysis: TextCheckerResult,
    referatPublisert: boolean,
    spraksjekkEnabled: boolean
) {
    const mappedAnalysis = mapSpraksjekkAnalysis(analysis);
    return logUmamiEvent("referat lagret", { analysis: mappedAnalysis, referatPublisert, spraksjekkEnabled, variant: "D" });
}

export function logModalLukket({
                                   isDirty,
                                   aktivitet,
                                   modalType,
                                   navType,
                               }: {
    isDirty: boolean;
    aktivitet: string;
    modalType: "ny-aktivitet" | "endre-aktivitet";
    navType: "onReqBack" | "onReqClose";
}) {
    return logUmamiEvent("modal lukket", { isDirty, aktivitet, modalType, navType });
}

export function loggDyplenkingTilAnnenBruker() {
    return logUmamiEvent("dyplenking", { text: "Dyplenking til annen bruker" });
}
