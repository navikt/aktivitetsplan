import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Textarea } from '@navikt/ds-react';
import { PayloadAction, isFulfilled } from '@reduxjs/toolkit';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { Status } from '../../../../createGenericSlice';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { HiddenIfHovedknapp } from '../../../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { DirtyContext } from '../../../context/dirty-context';
import { selectPubliserOgOppdaterReferatFeil } from '../../../feilmelding/feil-selector';
import Feilmelding from '../../../feilmelding/Feilmelding';
import { oppdaterReferat, publiserReferat } from '../../aktivitet-actions';
import { useReferatStartTekst } from '../../aktivitet-forms/samtalereferat/useReferatStartTekst';
import { selectAktivitetStatus } from '../../aktivitet-selector';

const schema = z.object({
    referat: z.string().min(0).max(5000),
});

type ReferatInputProps = z.infer<typeof schema>;

interface Props {
    aktivitet: MoteAktivitet | SamtalereferatAktivitet;
    onFerdig: () => void;
}

const OppdaterReferatForm = (props: Props) => {
    const { aktivitet, onFerdig } = props;
    const startTekst = useReferatStartTekst();

    const dispatch = useAppDispatch();

    const aktivitetsStatus = useSelector(selectAktivitetStatus);

    const erReferatPublisert = aktivitet.erReferatPublisert;

    const {
        watch,
        formState: { isDirty, isSubmitting },
        register,
        handleSubmit,
    } = useForm<ReferatInputProps>({
        resolver: zodResolver(schema),
        defaultValues: {
            referat: aktivitet.referat || startTekst,
        },
    });
    const oppdaterer = isSubmitting || aktivitetsStatus === Status.PENDING || aktivitetsStatus === Status.RELOADING;

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('referat', !isDirty);
        return () => setFormIsDirty('referat', false);
    }, [setFormIsDirty, isDirty]);

    const updateReferat = (referatData: ReferatInputProps) => {
        const aktivitetMedOppdatertReferat = {
            ...aktivitet,
            referat: referatData.referat,
        };
        return dispatch(oppdaterReferat(aktivitetMedOppdatertReferat)).then((action) => {
            if (isFulfilled(action)) {
                onFerdig();
            }
            return action;
        });
    };

    const updateAndPubliser = handleSubmit((values) => {
        return updateReferat(values).then((action: PayloadAction<any>) => {
            if (action.payload) {
                dispatch(publiserReferat(action.payload));
            }
        });
    });

    const feil = useSelector(selectPubliserOgOppdaterReferatFeil);

    const referatValue = watch('referat');

    return (
        <form
            onSubmit={handleSubmit(updateReferat)}
            className="space-y-4 bg-surface-alt-3-subtle p-4 border border-border-alt-3 rounded-md"
        >
            <Textarea
                label={`Samtalereferat`}
                disabled={oppdaterer}
                maxLength={5000}
                placeholder="Skriv samtalereferatet her"
                {...register('referat')}
                value={referatValue}
            />

            <Feilmelding feilmeldinger={feil} />
            <div className="space-x-4">
                <HiddenIfHovedknapp
                    loading={oppdaterer}
                    disabled={oppdaterer}
                    hidden={erReferatPublisert}
                    onClick={updateAndPubliser}
                >
                    Del med bruker
                </HiddenIfHovedknapp>

                <Button
                    variant={erReferatPublisert ? 'primary' : 'secondary'}
                    loading={oppdaterer}
                    disabled={oppdaterer}
                >
                    {erReferatPublisert ? 'Del endring' : 'Lagre utkast'}
                </Button>

                {aktivitet.referat && (
                    <Button variant="tertiary" onClick={onFerdig}>
                        Avbryt
                    </Button>
                )}
            </div>
        </form>
    );
};

export default OppdaterReferatForm;
