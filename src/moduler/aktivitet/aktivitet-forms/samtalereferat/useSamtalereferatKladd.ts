import { useCallback, useRef } from 'react';
import { Kanal } from '../../../../datatypes/aktivitetTypes';

interface SamtalereferatKladdNyttAktivitetskort {
    tittel: string | null;
    fraDato: string | null;
    kanal: Kanal;
    referat: string;
}

interface SamtalereferatLagretAktivitetskort {
    referat: string;
}

interface KladdInnslag {
    samtalereferat: SamtalereferatKladdNyttAktivitetskort | SamtalereferatLagretAktivitetskort;
    tidspunkt: number;
}

const localeStorageKeyPrefix = "samtalereferatKladd"

export const slettGamleSamtalereferatKladder = () => {
    const nå = Date.now();
    const åtteTimerMillis = 3600000 * 8;
    const lagredeItems = Object.keys(localStorage).filter((key) => key.startsWith(localeStorageKeyPrefix));

    try {
        lagredeItems.forEach((key) => {
            const kladdInnslag = localStorage.getItem(key);
            if (kladdInnslag) {
                try {
                    const parsedKladdInnslag: KladdInnslag = JSON.parse(kladdInnslag);
                    const harUtlopt = (nå - åtteTimerMillis) > parsedKladdInnslag.tidspunkt;
                    if (harUtlopt) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    localStorage.removeItem(key);
                }
            }
        })
    }
}

export const useSamtalereferatKladd = (oppfolgingsperiodeId: string | null, aktivitetId?: string) => {
    const debouncedDelay = 500;
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const localStorageKey = aktivitetId ? `${localeStorageKeyPrefix}-${aktivitetId}` : `${localeStorageKeyPrefix}-${oppfolgingsperiodeId}`;

    const lagreSamtalereferatKladd = useCallback((samtalereferat: SamtalereferatKladdNyttAktivitetskort) => {
        if (!oppfolgingsperiodeId) return;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            const kladdInnslag = {samtalereferat, tidspunkt: Date.now()}
            localStorage.setItem(localStorageKey, JSON.stringify(kladdInnslag));
        }, debouncedDelay);
    }, [localStorageKey]);

    const lagreSamtalereferatKladdLagretAktivitet = useCallback((referatKladd: string) => {
        if (!oppfolgingsperiodeId) return;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            const kladdInnslag = {samtalereferat: referatKladd, tidspunkt: Date.now()}
            localStorage.setItem(localStorageKey, JSON.stringify(kladdInnslag));
        }, debouncedDelay);
    }, [localStorageKey]);

    const hentSamtaleReferatKladd = (): SamtalereferatKladdNyttAktivitetskort | null => {
        const kladdInnslag = localStorage.getItem(localStorageKey);
        if (kladdInnslag) {
            const parsedKladdInnslag: KladdInnslag = JSON.parse(kladdInnslag);
            return parsedKladdInnslag?.samtalereferat as SamtalereferatKladdNyttAktivitetskort;
        } else {
            return null;
        }
    }

    const hentSamtaleReferatKladdLagretAktivitet = (): string | null => {
        const kladdInnslag = localStorage.getItem(localStorageKey);
        if (kladdInnslag) {
            return JSON.parse(kladdInnslag).samtalereferat;
        } else {
            return null;
        }
    }

    const slettSamtaleReferatKladd = () => {
        localStorage.removeItem(localStorageKey);
    }

    return { lagreSamtalereferatKladd, lagreSamtalereferatKladdLagretAktivitet, hentSamtaleReferatKladd, slettSamtaleReferatKladd, hentSamtaleReferatKladdLagretAktivitet};
};
