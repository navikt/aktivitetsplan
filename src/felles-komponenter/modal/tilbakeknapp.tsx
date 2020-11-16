import { VenstreChevron } from 'nav-frontend-chevron';
import React from 'react';

import InternLenke from '../utils/InternLenke';

interface TilbakeknappType {
    tekst: string;
    onClick: () => void;
}

export default function Tilbakeknapp(props: TilbakeknappType) {
    const { tekst, onClick } = props;
    return (
        <InternLenke href="/" onClick={onClick} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">{tekst}</span>
            </div>
        </InternLenke>
    );
}
