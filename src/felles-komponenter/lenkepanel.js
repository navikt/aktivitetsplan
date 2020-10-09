import React from 'react';
import NavLenkepanel from 'nav-frontend-lenkepanel';
import InternLenke from './utils/InternLenke';
import hiddenIf from './hidden-if/hidden-if';

function LenkeUtenStyling(props) {
    return <InternLenke {...props} skipLenkeStyling />;
}

function Lenkepanel(props) {
    return <NavLenkepanel linkCreator={LenkeUtenStyling} {...props} />;
}

export default hiddenIf(Lenkepanel);
