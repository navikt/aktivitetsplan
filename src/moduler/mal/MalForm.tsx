import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Textarea } from '@navikt/ds-react';
import { isFulfilled } from '@reduxjs/toolkit';
import React, { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { z } from 'zod';

import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectOppdaterMalFeil } from '../feilmelding/feil-selector';
import Feilmelding from '../feilmelding/Feilmelding';
import { oppdaterMal } from './aktivitetsmal-slice';
import { hentMalListe } from './malliste-slice';
import { logKlikkKnapp } from '../../analytics/analytics';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';

const schema = z.object({
    mal: z.string().min(1, 'Feltet må fylles ut').max(500, 'Du må korte ned teksten til 500 tegn'),
});
type MalFormValues = z.infer<typeof schema>;

interface Props {
    mal?: string;
    dirtyRef: MutableRefObject<boolean>;
    handleComplete: () => void;
}

const MalForm = (props: Props) => {
    const { mal, dirtyRef, handleComplete } = props;

    const dispatch = useAppDispatch();

    const ref = useRef<HTMLTextAreaElement | null>(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (el) {
            el?.focus();
            el.selectionStart = el.selectionEnd = el.value.length;
        }
    }, []);

    const onSubmit = (data: { mal: string }) => {
        if (data.mal !== props.mal) {
            dispatch(oppdaterMal({ mal: data.mal.trim() })).then((action) => {
                if (isFulfilled(action)) {
                    dispatch(hentMalListe()).then(() => handleComplete());
                }
            });
        } else {
            handleComplete();
        }
        const elem = document.querySelector('.aktivitet-modal') as HTMLDivElement;
        elem && elem?.focus();
        return Promise.resolve();
    };

    const defaultValues: MalFormValues = {
        mal: mal || '',
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<MalFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: true });

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const malValue = watch('mal'); // for <Textarea /> character-count to work

    const feil = useSelector(selectOppdaterMalFeil);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);

    return (
        <form className="my-4 space-y-8" onSubmit={handleSubmit((data) => onSubmit(data))}>
            <Textarea
                label="Mitt mål (obligatorisk)"
                maxLength={500}
                aria-label="Mitt mål"
                {...register('mal')}
                error={errors.mal && errors.mal.message}
                value={malValue}
                disabled={isSubmitting || !harSkriveTilgang || !underOppfolging}
            />
            <Feilmelding feilmeldinger={feil} />
            <Button onClick={() => logKlikkKnapp('Lagre mål')} disabled={isSubmitting}>
                Lagre
            </Button>
        </form>
    );
};

export default MalForm;
