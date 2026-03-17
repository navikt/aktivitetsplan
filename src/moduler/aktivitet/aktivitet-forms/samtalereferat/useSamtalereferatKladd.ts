import { useCallback, useRef } from 'react';

interface KladdInnslag {
    kladd: string;
    tidspunkt: number;
}

export const useSamtalereferatKladd = (brukerFnr: string) => {
    const debouncedDelay = 500;
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const localeStorageKeyPrefix = "samtalereferatKladd"
    const localStorageKey = `${localeStorageKeyPrefix}-${brukerFnr}`;

    const lagreSamtalereferatKladd: (referat:string) => void = useCallback((referat: string) => {
        slettEldreSamtalereferatKladder();
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            const kladdInnslag = {kladd: referat, tidspunkt: Date.now()}
            localStorage.setItem(localStorageKey, JSON.stringify(kladdInnslag));
        }, debouncedDelay);
    }, [localStorageKey]);

    const hentSamtaleReferatKladd = (): string | null => {
        const kladdInnslag = localStorage.getItem(localStorageKey);
        if (!kladdInnslag) {
            return null;
        } else {
            const parsedKladdInnslag: KladdInnslag = JSON.parse(kladdInnslag);
            return parsedKladdInnslag.kladd;
        }
    }

    const slettSamtaleReferatKladd = () => {
        localStorage.removeItem(localStorageKey);
    }

    const slettEldreSamtalereferatKladder = () => {
        const nå = Date.now();
        const åtteTimerMillis = 3600000 * 8;
        const lagredeItems = Object.keys(localStorage).filter((key) => key.startsWith(localeStorageKeyPrefix));

        lagredeItems.forEach((key) => {
            const kladdInnslag = localStorage.getItem(key);
            if (kladdInnslag) {
                const parsedKladdInnslag: KladdInnslag = JSON.parse(kladdInnslag);
                const harUtlopt = (nå - åtteTimerMillis) > parsedKladdInnslag.tidspunkt;
                if (harUtlopt) {
                    localStorage.removeItem(key);
                }
            }
        })
    }

    return { lagreSamtalereferatKladd, hentSamtaleReferatKladd, slettSamtaleReferatKladd};
};
