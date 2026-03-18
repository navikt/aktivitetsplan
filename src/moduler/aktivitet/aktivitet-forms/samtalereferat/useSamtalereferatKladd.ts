import { useCallback, useRef } from 'react';
import { Kanal } from '../../../../datatypes/aktivitetTypes';

interface SamtalereferatKladd {
    tittel: string | null;
    fraDato: string | null;
    kanal: Kanal;
    referat: string;
}

interface KladdInnslag {
    samtalereferat: SamtalereferatKladd;
    tidspunkt: number;
}

export const useSamtalereferatKladd = (brukerFnr: string, aktivitetId?: string) => {
    const debouncedDelay = 500;
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const localeStorageKeyPrefix = "samtalereferatKladd"
    const localStorageKey = aktivitetId ? `${localeStorageKeyPrefix}-${aktivitetId}` : `${localeStorageKeyPrefix}-${brukerFnr}`;

    const lagreSamtalereferatKladd = useCallback((samtalereferat: SamtalereferatKladd) => {
        slettEldreSamtalereferatKladder();
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            const kladdInnslag = {samtalereferat, tidspunkt: Date.now()}
            localStorage.setItem(localStorageKey, JSON.stringify(kladdInnslag));
        }, debouncedDelay);
    }, [localStorageKey]);

    const lagreSamtalereferatKladdLagretAktivitet = useCallback((referatKladd: string) => {
        slettEldreSamtalereferatKladder();
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            localStorage.setItem(localStorageKey, JSON.stringify(referatKladd));
        }, debouncedDelay);
    }, [localStorageKey]);

    const hentSamtaleReferatKladd = (): SamtalereferatKladd | null => {
        const kladdInnslag = localStorage.getItem(localStorageKey);
        if (!kladdInnslag) {
            return null;
        } else {
            const parsedKladdInnslag: KladdInnslag = JSON.parse(kladdInnslag);
            return parsedKladdInnslag.samtalereferat;
        }
    }

    const hentSamtaleReferatKladdLagretAktivitet = (): string | null => {
        const kladdInnslag = localStorage.getItem(localStorageKey);
        if (!kladdInnslag) {
            return null;
        } else {
            return JSON.parse(kladdInnslag);
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

    return { lagreSamtalereferatKladd, lagreSamtalereferatKladdLagretAktivitet, hentSamtaleReferatKladd, slettSamtaleReferatKladd, hentSamtaleReferatKladdLagretAktivitet};
};
