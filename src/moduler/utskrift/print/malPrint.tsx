import { Heading } from '@navikt/ds-react';
import React from 'react';

import { Mal } from '../../../datatypes/oppfolgingTypes';

interface Props {
    mittMal?: Mal;
}

function MalPrint(props: Props) {
    const mal = props.mittMal && props.mittMal.mal;
    if (!mal) return null;

    return (
        <section className="printmodal-body__vismittmal">
            <Heading level="1" size="medium">
                Mitt mål
            </Heading>
            <p>{mal}</p>
        </section>
    );
}

export default MalPrint;
