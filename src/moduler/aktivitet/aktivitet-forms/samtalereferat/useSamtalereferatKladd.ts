import { useState } from 'react';

export const useSamtalereferatKladd = (brukerFnr: string) => {
    const localStorageKey = `samtalereferatKladd-${brukerFnr}`;
    // const [samtalereferatKladd, setSamtalereferatKladd] = useState<string>(localStorage.getItem(localStorageKey) || '');

    const lagreSamtalereferatKladd = (referat: string) => {
        // setSamtalereferatKladd(referat);
        localStorage.setItem(localStorageKey, JSON.stringify(referat));
        console.log(referat);
    }

    return {lagreSamtalereferatKladd};
}
