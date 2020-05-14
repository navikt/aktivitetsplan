import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { Mal } from '../../../types';

interface Props {
    mittMal?: Mal;
}

function MalPrint(props: Props) {
    const mal = props.mittMal && props.mittMal.mal;
    if (!mal) return null;

    return (
        <section className="printmodal-body__vismittmal">
            <Systemtittel tag="h1" className="printmodal-body__vismittmal--overskrift">
                Mitt mål
            </Systemtittel>
            <p>{mal}</p>
        </section>
    );
}

export default MalPrint;
