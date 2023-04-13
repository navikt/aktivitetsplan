import { Link } from '@navikt/ds-react';
import React from 'react';

interface TilbakeknappType {
    tekst: string;
    onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

const Tilbakeknapp = (props: TilbakeknappType) => {
    const { tekst, onClick } = props;

    return (
        <Link onClick={onClick} className="hover:cursor-pointer">
            {tekst}
        </Link>
    );
};

export default Tilbakeknapp;
