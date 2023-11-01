import { BodyShort, Detail, Heading } from '@navikt/ds-react';
import React from 'react';

import ControlledDatePicker from '../../../../felles-komponenter/skjema/datovelger/ControlledDatePicker';

interface Props {
    datoBegrensninger: { after: Date };
}

export const SvarPaaVegneAvBruker = ({ datoBegrensninger }: Props) => {
    return (
        <div className="mb-4 bg-surface-alt-3-subtle border-border-alt-3 border rounded-md p-4 space-y-4">
            <div className="flex justify-between">
                <Heading size="small" level="3">
                    Svar på vegne av brukeren
                </Heading>
                <Detail>FOR NAV-ANSATT</Detail>
            </div>
            <BodyShort>Når var du i dialog med brukeren om å dele CV-en deres med denne arbeidsgiveren</BodyShort>
            <ControlledDatePicker
                field={{ label: 'Dato (obligatorisk)', required: true, name: 'avtaltDato' }}
                disabledDays={[datoBegrensninger]}
            />
        </div>
    );
};
