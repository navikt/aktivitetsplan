import {
    BodyShort,
    UNSAFE_DatePicker as DatePicker,
    Heading,
    UNSAFE_useDatepicker as useDatepicker,
} from '@navikt/ds-react';
import { FieldState } from '@nutgaard/use-formstate';
import React from 'react';
import { useSelector } from 'react-redux';

import EtikettBase from '../../../../felles-komponenter/etikett-base/EtikettBase';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import styles from './SvarPaaVegneAvBruker.module.less';

interface Props {
    formhandler: FieldState;
    datoBegrensninger: { after: Date; before: Date };
}

export const SvarPaaVegneAvBruker = ({ formhandler, datoBegrensninger }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    const { datepickerProps, inputProps } = useDatepicker({
        disabled: [datoBegrensninger],
        onDateChange: (val) => {
            formhandler.setValue(val?.toISOString() || '');
        },
    });

    if (!erVeileder) return null;

    const feil = formhandler.touched ? formhandler.error : undefined;
    return (
        <div className="mb-4 bg-surface-alt-3-subtle border-border-alt-3 border rounded-md p-4">
            <div className="flex justify-between">
                <Heading size="medium" level="3">
                    Svar på vegne av brukeren
                </Heading>
                <BodyShort size="small">FOR NAV-ANSATT</BodyShort>
            </div>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    {...inputProps}
                    error={feil}
                    label={
                        <BodyShort>
                            Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren
                        </BodyShort>
                    }
                />
            </DatePicker>
        </div>
    );
};
