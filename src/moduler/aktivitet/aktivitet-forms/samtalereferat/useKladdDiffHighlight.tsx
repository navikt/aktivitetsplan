import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const KLADD_HIGHLIGHT_NAVN = 'samtalereferat-kladd-lagt-til';
const KLADD_HIGHLIGHT_STYRKE_VAR = '--kladd-highlight-styrke';

interface TekstOmrade {
    start: number;
    end: number;
}

// Enkel prefiks/suffiks-diff: finner kun teksten som er lagt til midt i den lagrede kladden
// sammenlignet med referatet slik det var før kladden ble hentet inn.
const finnLagtTilTekst = (opprinnelig: string, oppdatert: string): TekstOmrade[] => {
    if (opprinnelig === oppdatert) {
        return [];
    }

    const maksPrefiks = Math.min(opprinnelig.length, oppdatert.length);
    let prefiksLengde = 0;
    while (prefiksLengde < maksPrefiks && opprinnelig[prefiksLengde] === oppdatert[prefiksLengde]) {
        prefiksLengde += 1;
    }

    const maksSuffiks = Math.min(opprinnelig.length, oppdatert.length) - prefiksLengde;
    let suffiksLengde = 0;
    while (
        suffiksLengde < maksSuffiks &&
        opprinnelig[opprinnelig.length - 1 - suffiksLengde] === oppdatert[oppdatert.length - 1 - suffiksLengde]
    ) {
        suffiksLengde += 1;
    }

    const start = prefiksLengde;
    const end = oppdatert.length - suffiksLengde;

    return end > start ? [{ start, end }] : [];
};

const stotterCssHighlightApi = () =>
    typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

interface UseKladdDiffHighlightArgs {
    /** Nåværende verdi i referat-feltet. */
    referatVerdi: string;
    /** Referatet slik det var før en eventuell kladd ble hentet inn, brukes som diff-grunnlag. */
    originaltReferat: string;
    /** Henter en eventuell lagret kladd fra localStorage. */
    hentKladd: () => string | null;
    /** Kalles med kladdteksten dersom en kladd blir funnet, for å oppdatere skjemaverdien. */
    settReferat: (kladd: string) => void;
}

interface UseKladdDiffHighlightResult {
    /** Ref-callback som må settes på selve <textarea>-elementet (kombineres med ev. andre refs). */
    textareaRef: (node: HTMLTextAreaElement | null) => void;
    /** Må kobles til onScroll på tekstfeltet slik at overlegget følger scrollposisjonen. */
    onTextareaScroll: () => void;
    /**
     * Usynlig overlegg + stilregel som tegner fremhevingen. Render denne som søsken av
     * tekstfeltet, inne i en wrapper med `position: relative`.
     */
    highlightOverlay: React.ReactNode;
}

/**
 * Fremhever midlertidig, med en kort uttoning, teksten som ble lagt til av en samtalereferat-kladd
 * som er gjenopprettet fra localStorage. Bruker CSS Custom Highlight API, som kun virker mot ekte
 * DOM-tekstnoder – derfor speiles teksten i et usynlig overlegg som fremhevingen tegnes på, lagt
 * oppå det ekte (transparente) <textarea>-elementet.
 */
export const useKladdDiffHighlight = ({
    referatVerdi,
    originaltReferat,
    hentKladd,
    settReferat,
}: UseKladdDiffHighlightArgs): UseKladdDiffHighlightResult => {
    // Fanger opp verdien slik den var da hooken først ble tatt i bruk. Senere endringer i
    // originaltReferat (f.eks. re-render med ny prop) skal ikke påvirke diff-grunnlaget.
    const referatFoerKladdRef = useRef(originaltReferat);

    const [innlastetKladd, setInnlastetKladd] = useState<string | null>(null);
    const [kladdOmrader, setKladdOmrader] = useState<TekstOmrade[]>([]);

    const textareaElementRef = useRef<HTMLTextAreaElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const backdropTekstRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const kladd = hentKladd();
        if (kladd) {
            settReferat(kladd);
            setInnlastetKladd(kladd);
            setKladdOmrader(finnLagtTilTekst(referatFoerKladdRef.current, kladd));
        }
        // Kun ved oppstart – vi ønsker ikke å hente kladden på nytt ved senere rerendringer.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fjern fremhevingen så snart brukeren skriver videre og teksten dermed avviker fra den
    // opprinnelig innlastede kladden.
    useEffect(() => {
        if (innlastetKladd !== null && referatVerdi !== innlastetKladd && kladdOmrader.length > 0) {
            setKladdOmrader([]);
        }
    }, [referatVerdi, innlastetKladd, kladdOmrader.length]);

    // ::highlight() støtter ikke CSS-transitions/animasjoner, så en gradvis uttoning må gjøres
    // manuelt ved å rAF-oppdatere en CSS-variabel som styrer hvor mye av fargen som blandes inn.
    useEffect(() => {
        if (kladdOmrader.length === 0) {
            return;
        }

        const holdMs = 250;
        const fadeMs = 750;
        document.documentElement.style.setProperty(KLADD_HIGHLIGHT_STYRKE_VAR, '100%');

        let rafId: number;
        let startTid: number | null = null;

        const fadeSteg = (tidsstempel: number) => {
            if (startTid === null) {
                startTid = tidsstempel;
            }
            const fremdrift = Math.min((tidsstempel - startTid) / fadeMs, 1);
            const styrke = 100 * (1 - fremdrift);
            document.documentElement.style.setProperty(KLADD_HIGHLIGHT_STYRKE_VAR, `${styrke}%`);
            if (fremdrift < 1) {
                rafId = requestAnimationFrame(fadeSteg);
            } else {
                setKladdOmrader([]);
            }
        };

        const holdTimeout = setTimeout(() => {
            rafId = requestAnimationFrame(fadeSteg);
        }, holdMs);

        return () => {
            clearTimeout(holdTimeout);
            cancelAnimationFrame(rafId);
        };
    }, [kladdOmrader]);

    // Overlegget skal ha nøyaktig samme skrifttype, innrykk og størrelse som den underliggende
    // tekstboksen for at fremhevingen skal treffe riktig tekst visuelt.
    useLayoutEffect(() => {
        const textarea = textareaElementRef.current;
        const backdrop = backdropRef.current;
        if (!textarea || !backdrop) {
            return;
        }

        const computed = window.getComputedStyle(textarea);
        const kopierteEgenskaper: (keyof CSSStyleDeclaration)[] = [
            'boxSizing',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            'borderTopWidth',
            'borderRightWidth',
            'borderBottomWidth',
            'borderLeftWidth',
            'fontFamily',
            'fontSize',
            'fontWeight',
            'lineHeight',
            'letterSpacing',
            'wordSpacing',
        ];
        kopierteEgenskaper.forEach((egenskap) => {
            (backdrop.style as unknown as Record<string, string>)[egenskap as string] = computed[egenskap] as string;
        });
        backdrop.style.top = `${textarea.offsetTop}px`;
        backdrop.style.left = `${textarea.offsetLeft}px`;
        backdrop.style.width = `${textarea.offsetWidth}px`;
        backdrop.style.height = `${textarea.offsetHeight}px`;
    });

    useEffect(() => {
        const textarea = textareaElementRef.current;
        const backdrop = backdropRef.current;
        if (!textarea || !backdrop) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            backdrop.style.top = `${textarea.offsetTop}px`;
            backdrop.style.left = `${textarea.offsetLeft}px`;
            backdrop.style.width = `${textarea.offsetWidth}px`;
            backdrop.style.height = `${textarea.offsetHeight}px`;
        });
        resizeObserver.observe(textarea);
        return () => resizeObserver.disconnect();
    }, []);

    // Tegner fremhevingen ved hjelp av CSS Custom Highlight API. Dette fungerer kun mot ekte
    // DOM-tekstnoder, ikke mot verdien i et <textarea>-element, derfor speiles teksten i et
    // usynlig overlegg som fremhevingen tegnes på.
    useEffect(() => {
        if (!stotterCssHighlightApi()) {
            return;
        }

        const tekstNode = backdropTekstRef.current?.firstChild ?? null;
        if (!tekstNode || kladdOmrader.length === 0) {
            CSS.highlights.delete(KLADD_HIGHLIGHT_NAVN);
            return;
        }

        const tekstLengde = tekstNode.textContent?.length ?? 0;
        const ranges = kladdOmrader
            .map(({ start, end }) => {
                const range = new Range();
                range.setStart(tekstNode, Math.min(start, tekstLengde));
                range.setEnd(tekstNode, Math.min(end, tekstLengde));
                return range;
            })
            .filter((range) => !range.collapsed);

        if (ranges.length === 0) {
            CSS.highlights.delete(KLADD_HIGHLIGHT_NAVN);
            return;
        }

        CSS.highlights.set(KLADD_HIGHLIGHT_NAVN, new Highlight(...ranges));

        return () => {
            CSS.highlights.delete(KLADD_HIGHLIGHT_NAVN);
        };
    }, [kladdOmrader, referatVerdi]);

    const onTextareaScroll = () => {
        if (backdropRef.current && textareaElementRef.current) {
            backdropRef.current.scrollTop = textareaElementRef.current.scrollTop;
            backdropRef.current.scrollLeft = textareaElementRef.current.scrollLeft;
        }
    };

    const textareaRef = (node: HTMLTextAreaElement | null) => {
        textareaElementRef.current = node;
    };

    const highlightOverlay = (
        <>
            <style>{`::highlight(${KLADD_HIGHLIGHT_NAVN}) { background-color: color-mix(in srgb, var(--ax-bg-success-moderateA) var(${KLADD_HIGHLIGHT_STYRKE_VAR}, 100%), transparent); }`}</style>
            <div
                ref={backdropRef}
                aria-hidden="true"
                className="pointer-events-none select-none absolute overflow-hidden whitespace-pre-wrap break-words text-transparent"
            >
                <div ref={backdropTekstRef}>{referatVerdi}</div>
            </div>
        </>
    );

    return {
        textareaRef,
        onTextareaScroll,
        highlightOverlay,
    };
};
