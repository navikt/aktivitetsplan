import React from 'react';
import NavLenkepanel from 'nav-frontend-lenkepanel';
import Lenke from './utils/lenke';
import hiddenIf from './hidden-if/hidden-if';

function LenkeUtenStyling(props) {
    return <Lenke brukLenkestyling={false} {...props} />;
}

function Lenkepanel(props) {
    return <NavLenkepanel linkCreator={LenkeUtenStyling} {...props} />;
}

export default hiddenIf(Lenkepanel);
