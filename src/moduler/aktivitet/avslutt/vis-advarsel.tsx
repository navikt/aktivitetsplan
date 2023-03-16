import { Alert, Button, Heading } from '@navikt/ds-react';
import React from 'react';

interface Props {
    headerTekst: string;
    onSubmit: (value: any) => any;
}

const VisAdvarsel = ({ onSubmit, headerTekst }: Props) => {
    return (
        <div className="flex flex-col gap-8">
            <Heading level="1" size="large">
                {headerTekst}
            </Heading>
            <Alert variant="warning">Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.</Alert>
            <Button className="mt-4" onClick={onSubmit}>
                Lagre
            </Button>
        </div>
    );
};

export default VisAdvarsel;
