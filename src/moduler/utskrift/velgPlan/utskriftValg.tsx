import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';

interface Props {
    tittelId: string;
    tekstId: string;
}

const UtskriftValg = ({ tittelId, tekstId }: Props) => {
    return (
        <div>
            <Heading level="2" size="small">
                {tittelId}
            </Heading>
            <BodyShort>{tekstId}</BodyShort>
        </div>
    );
};

export default UtskriftValg;
