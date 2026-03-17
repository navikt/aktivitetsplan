import { useCallback, useRef } from 'react';

export const useSamtalereferatKladd = (brukerFnr: string) => {
    const debouncedDelay = 500;
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const localStorageKey = `samtalereferatKladd-${brukerFnr}`;

    const lagreSamtalereferatKladd: (referat:string) => void = useCallback((referat: string) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            localStorage.setItem(localStorageKey, referat);
        }, debouncedDelay);
    }, [localStorageKey]);

    const hentSamtaleReferatKladd = () => {
        return localStorage.getItem(localStorageKey);
    }

    return { lagreSamtalereferatKladd, hentSamtataleReferatKladd: hentSamtaleReferatKladd };
};
