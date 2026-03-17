import { useCallback, useRef, useState } from 'react';

export const useSamtalereferatKladd = (brukerFnr: string) => {
    const debouncedDelay = 500
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const localStorageKey = `samtalereferatKladd-${brukerFnr}`;

    const lagreSamtalereferatKladd = (referat: string) => {
        useCallback(() => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                localStorage.setItem(localStorageKey, JSON.stringify(referat))
            }, debouncedDelay)
        }, [localStorageKey, debouncedDelay]);
    }

    return {lagreSamtalereferatKladd};
}
