import NavLenkepanel from 'nav-frontend-lenkepanel';
import React from 'react';

import hiddenIf from './hidden-if/hidden-if';
import InternLenke from './utils/InternLenke';

function LenkeUtenStyling(props) {
    return <InternLenke {...props} skipLenkeStyling />;
}

function Lenkepanel(props) {
    return <NavLenkepanel linkCreator={LenkeUtenStyling} {...props} />;
}

export default hiddenIf(Lenkepanel);
