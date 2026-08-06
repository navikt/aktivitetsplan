import { useCallback, useRef } from 'react';
import { Kanal } from '../../../../datatypes/aktivitetTypes';
import * as z from 'zod';
import { ZodSchema } from 'zod';

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

const localeStorageKeyPrefix = 'samtalereferatKladd';
export const createLocalStorageKey = (
    args:
        | {
              aktivitetId: string;
          }
        | {
              oppfolgingsperiodeId: string;
          },
) => {
    return 'aktivitetId' in args
        ? `${localeStorageKeyPrefix}-${args.aktivitetId}`
        : `${localeStorageKeyPrefix}-${args.oppfolgingsperiodeId}`;
};

export const slettGamleSamtalereferatKladder = () => {
    const nå = Date.now();
    const åtteTimerMillis = 3600000 * 8;
    const lagredeItems = Object.keys(localStorage).filter((key) => key.startsWith(localeStorageKeyPrefix));

    lagredeItems.forEach((key) => {
        const kladdInnslag = localStorage.getItem(key);
        if (kladdInnslag) {
            try {
                const parsedKladdInnslag: KladdInnslag = JSON.parse(kladdInnslag);
                const harUtlopt = nå - åtteTimerMillis > parsedKladdInnslag.tidspunkt;
                if (harUtlopt) {
                    localStorage.removeItem(key);
                }
            } catch (error) {
                console.warn('Kunne ikke sette gamle samtalereferatkladder', error);
                localStorage.removeItem(key);
            }
        }
    });
};

const kladdSchema = z.object({
    samtalereferat: z.object({
        tittel: z.string().nullable(),
        fraDato: z.string().nullable(),
        kanal: z.nativeEnum(Kanal),
        referat: z.string(),
    }),
    tidspunkt: z.number(),
});

const kladdLagretAktivitetSchema = z.object({
    samtalereferat: z.string(),
    tidspunkt: z.number(),
});

export const useSamtalereferatKladd = (
    args:
        | {
              oppfolgingsperiodeId: string;
          }
        | {
              aktivitetId: string;
          },
) => {
    const debouncedDelay = 500;
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const localStorageKey = createLocalStorageKey(args);

    const lagreSamtalereferatKladd = useCallback(
        (samtalereferat: SamtalereferatKladdNyttAktivitetskort) => {
            debounce(timeoutRef, debouncedDelay, () => {
                const kladdInnslag = { samtalereferat, tidspunkt: Date.now() };
                localStorage.setItem(localStorageKey, JSON.stringify(kladdInnslag));
            });
        },
        [localStorageKey],
    );

    const lagreSamtalereferatKladdLagretAktivitet = useCallback(
        (referatKladd: string) => {
            debounce(timeoutRef, debouncedDelay, () => {
                const kladdInnslag = { samtalereferat: referatKladd, tidspunkt: Date.now() };
                localStorage.setItem(localStorageKey, JSON.stringify(kladdInnslag));
            });
        },
        [localStorageKey],
    );

    const hentSamtaleReferatKladd = (): SamtalereferatKladdNyttAktivitetskort | null => {
        return parseStoredKladd(localStorageKey, kladdSchema)?.samtalereferat || null;
    };

    const hentSamtaleReferatKladdLagretAktivitet = (): string | null => {
        return parseStoredKladd(localStorageKey, kladdLagretAktivitetSchema)?.samtalereferat || null;
    };

    const slettSamtaleReferatKladd = () => {
        localStorage.removeItem(localStorageKey);
    };

    return {
        lagreSamtalereferatKladd,
        lagreSamtalereferatKladdLagretAktivitet,
        hentSamtaleReferatKladd,
        slettSamtaleReferatKladd,
        hentSamtaleReferatKladdLagretAktivitet,
    };
};

const debounce = (
    timeoutRef: React.RefObject<ReturnType<typeof setTimeout> | undefined>,
    debouncedDelay: number,
    fun: () => void,
) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fun, debouncedDelay);
};

const parseStoredKladd = <T>(localStorageKey: string, schema: ZodSchema<T>) => {
    const kladdInnslag = localStorage.getItem(localStorageKey);
    if (kladdInnslag) {
        const result = schema.safeParse(JSON.parse(kladdInnslag));
        if (result.success) {
            return result.data;
        } else {
            return null;
        }
    } else {
        return null;
    }
};
