import {
    BodyShort,
    UNSAFE_DatePicker as DatePicker,
    Detail,
    Heading,
    UNSAFE_useDatepicker as useDatepicker,
} from '@navikt/ds-react';
import { FieldState } from '@nutgaard/use-formstate';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { preventCloseOnInsideClick, useOutsideClick } from '../../../../felles-komponenter/skjema/datovelger/common';
import { selectErVeileder } from '../../../identitet/identitet-selector';

interface Props {
    formhandler: FieldState;
    datoBegrensninger: { after: Date; before: Date };
}

export const SvarPaaVegneAvBruker = ({ formhandler, datoBegrensninger }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    const [popoverOpen, setPopoverOpen] = useState(false);
    useOutsideClick(popoverOpen, () => setPopoverOpen(false));
    const { datepickerProps, inputProps } = useDatepicker({
        disabled: [datoBegrensninger],
        onDateChange: (val) => {
            formhandler.setValue(val?.toISOString() || '');
            if (val != undefined) {
                setPopoverOpen(false);
            }
        },
    });

    if (!erVeileder) return null;

    const feil = formhandler.touched ? formhandler.error : undefined;
    return (
        <div className="mb-4 bg-surface-alt-3-subtle border-border-alt-3 border rounded-md p-4 space-y-4">
            <div className="flex justify-between">
                <Heading size="small" level="3">
                    Svar på vegne av brukeren
                </Heading>
                <Detail>FOR NAV-ANSATT</Detail>
            </div>
            <BodyShort>Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren</BodyShort>
            <div onClick={preventCloseOnInsideClick}>
                <DatePicker {...datepickerProps} onOpenToggle={() => setPopoverOpen(!popoverOpen)} open={popoverOpen}>
                    <DatePicker.Input {...inputProps} error={feil} label={'Dato (obligatorisk)'} />
                </DatePicker>
            </div>
        </div>
    );
};
