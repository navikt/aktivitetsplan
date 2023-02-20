import { ChevronLeftCircle } from '@navikt/ds-icons';
import React from 'react';

import InternLenke from '../utils/InternLenke';

interface TilbakeknappType {
    tekst: string;
    onClick: () => void;
}

const Tilbakeknapp = (props: TilbakeknappType) => {
    const { tekst, onClick } = props;

    return (
        <InternLenke href="/" onClick={onClick} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <ChevronLeftCircle />
                <span className="tilbakeknapp-innhold__tekst">{tekst}</span>
            </div>
        </InternLenke>
    );
};

export default Tilbakeknapp;
