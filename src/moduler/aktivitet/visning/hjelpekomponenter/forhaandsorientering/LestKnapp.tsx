import { Button } from '@navikt/ds-react';
import React from 'react';

interface Props {
    hidden: boolean;
    lasterData: boolean;
    onClick(): void;
}

const LestKnapp = (props: Props) => {
    const { hidden, lasterData, onClick } = props;

    if (hidden) {
        return null;
    }

    return (
        <Button variant="secondary" onClick={onClick} className="mt-5" loading={lasterData} size="small">
            Ok, jeg har lest beskjeden
        </Button>
    );
};

export default LestKnapp;
