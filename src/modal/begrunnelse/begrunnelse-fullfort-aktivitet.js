import React from 'react';
import BegrunnelseAktivitet from './begrunnelse-aktivitet';

const BegrunnelseFullfortAktivitet = () => {
    const headerTekst = <span>Begrunnelse for fullført aktivitet</span>;
    const beskrivelseTekst = <span>Aktiviteteter bla bla bla</span>;

    return (
        <BegrunnelseAktivitet headerTekst={headerTekst} beskrivelseTekst={beskrivelseTekst} />
    );
};

export default BegrunnelseFullfortAktivitet;
