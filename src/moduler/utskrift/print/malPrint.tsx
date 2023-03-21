import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';

import { Mal } from '../../../datatypes/oppfolgingTypes';

interface Props {
    mittMal?: Mal;
}

function MalPrint(props: Props) {
    const mal = props.mittMal && props.mittMal.mal;
    if (!mal) return null;

    return (
        <section className="my-8">
            <Heading level="1" size="large">
                Mitt mål
            </Heading>
            <BodyShort>{mal}</BodyShort>
        </section>
    );
}

export default MalPrint;
