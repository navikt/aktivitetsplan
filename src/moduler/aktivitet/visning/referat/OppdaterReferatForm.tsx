import { Button } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { STATUS } from '../../../../api/utils';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { HiddenIfHovedknapp } from '../../../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import { DirtyContext } from '../../../context/dirty-context';
import { oppdaterReferat, publiserReferat } from '../../aktivitet-actions';
import { useReferatStartTekst } from '../../aktivitet-forms/samtalereferat/useReferatStartTekst';
import { selectAktivitetStatus } from '../../aktivitet-selector';

const validate = (val: string) => {
    if (val.trim().length === 0) {
        return 'Du må fylle ut samtalereferat';
    }
    if (val.length > 5000) {
        return 'Du må korte ned teksten til 5000 tegn';
    }
};

interface Props {
    aktivitet: MoteAktivitet | SamtalereferatAktivitet;
    onFerdig: () => void;
}

type ReferatInputProps = {
    referat: string;
};

const OppdaterReferatForm = (props: Props) => {
    const { aktivitet, onFerdig } = props;
    const startTekst = useReferatStartTekst();

    const dispatch = useDispatch();

    const aktivitetsStatus = useSelector(selectAktivitetStatus);
    const oppdaterer = aktivitetsStatus === (STATUS.PENDING || STATUS.RELOADING);

    const erReferatPublisert = aktivitet.erReferatPublisert;

    const validator = useFormstate<ReferatInputProps>({
        referat: validate,
    });

    const state = validator({
        referat: aktivitet.referat || startTekst,
    });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('referat', !state.pristine);

        return () => setFormIsDirty('referat', false);
    }, [setFormIsDirty, state.pristine]);

    const onSubmit = (referatData: ReferatInputProps) => {
        const aktivitetMedOppdatertReferat = {
            ...props.aktivitet,
            ...referatData,
        };

        return oppdaterReferat(aktivitetMedOppdatertReferat)(dispatch).then((res: any) => {
            onFerdig();
            return res;
        });
    };

    const oppdaterOgPubliser = state.onSubmit((values) => {
        return onSubmit(values).then((response: { data: any }) => {
            if (response.data) {
                dispatch(publiserReferat(response.data) as unknown as AnyAction);
            }
        });
    });

    return (
        <form onSubmit={state.onSubmit(onSubmit)} className={classNames('space-y-4')}>
            <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            <Textarea
                label={`Samtalereferat`}
                disabled={oppdaterer}
                maxLength={5000}
                visTellerFra={500}
                placeholder="Skriv samtalereferatet her"
                {...state.fields.referat}
            />

            <div className="space-x-4">
                <HiddenIfHovedknapp
                    kompakt
                    loading={oppdaterer}
                    disabled={oppdaterer}
                    hidden={erReferatPublisert}
                    onClick={oppdaterOgPubliser}
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
