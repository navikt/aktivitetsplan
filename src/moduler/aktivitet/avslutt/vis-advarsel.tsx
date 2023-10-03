import { Alert, Button } from '@navikt/ds-react';
import React, { MouseEventHandler } from 'react';

interface Props {
    onSubmit: MouseEventHandler<HTMLButtonElement>;
}

const VisAdvarsel = ({ onSubmit }: Props) => {
    return (
        <div className="flex flex-col gap-8">
            <Alert variant="warning" inline>
                Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.
            </Alert>
            <Button className="self-baseline" onClick={onSubmit}>
                Lagre
            </Button>
        </div>
    );
};

export default VisAdvarsel;
