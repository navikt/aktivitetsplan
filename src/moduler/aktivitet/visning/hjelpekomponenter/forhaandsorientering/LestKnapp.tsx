import { Button } from '@navikt/ds-react';
import React from 'react';

interface Props {
    lasterData: boolean;
    onClick(): void;
}

const LestKnapp = (props: Props) => {
    const { lasterData, onClick } = props;

    return (
        <Button variant="secondary" onClick={onClick} className="mt-5" loading={lasterData} size="medium">
            Ok, jeg har lest beskjeden
        </Button>
    );
};

export default LestKnapp;
