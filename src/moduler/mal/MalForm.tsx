import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import { oppdaterMal } from './aktivitetsmal-reducer';
import { hentMalListe } from './malliste-reducer';

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

    const dispatch = useReduxDispatch();

    const ref = useRef<HTMLTextAreaElement | null>(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = el.value.length;
        }
    }, []);

    const onSubmit = (data: { mal: string }) => {
        if (data.mal !== props.mal) {
            dispatch(oppdaterMal({ mal: data.mal }))
                .then(() => dispatch(hentMalListe()))
                .then(handleComplete());
        } else {
            handleComplete();
        }
        const elem = document.querySelector('.aktivitet-modal') as HTMLDivElement;
        elem && elem.focus();
        return Promise.resolve();
    };

    const defaultValues: MalFormValues = {
        mal: mal || '',
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm<MalFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: true });

    console.log(isDirty);

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const malValue = watch('mal'); // for <Textarea /> character-count to work

    return (
        <form className="my-4 space-y-8" onSubmit={handleSubmit((data) => onSubmit(data))}>
            <Textarea
                label="Mitt mål (obligatorisk)"
                maxLength={500}
                aria-label="Mitt mål"
                {...register('mal')}
                error={errors.mal && errors.mal.message}
                value={malValue}
            />
            <Button>Lagre</Button>
        </form>
    );
};

export default MalForm;
