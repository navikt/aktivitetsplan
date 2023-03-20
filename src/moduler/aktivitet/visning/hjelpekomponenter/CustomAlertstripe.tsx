import { Alert } from '@navikt/ds-react';
import React from 'react';

interface Props {
    tekst: string;
}

export const CustomAlertstripe = (props: Props) => (
    <Alert variant={'warning'} inline className="gap-x-2">
        {props.tekst}
    </Alert>
);
