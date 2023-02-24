import { WarningColored } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';

interface Props {
    tekst: string;
    sectionClassName?: string;
    ikonClassName?: string;
}

export const CustomAlertstripe = (props: Props) => (
    <div className="flex items-center mr-2">
        <WarningColored className="mr-2 mb-1" />
        <BodyShort>{props.tekst}</BodyShort>
    </div>
);
