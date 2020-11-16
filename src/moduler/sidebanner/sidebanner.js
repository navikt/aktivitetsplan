import { Sidetittel } from 'nav-frontend-typografi';
import React from 'react';

import visibleIf from '../../hocs/visible-if';

function Sidebanner() {
    return (
        <div className="sidebanner-container">
            <div className="sidebanner-grid">
                <div className="sidebanner">
                    <Sidetittel className="sidebanner__tittel">Aktivitetsplan</Sidetittel>
                </div>
            </div>
        </div>
    );
}

export default visibleIf(Sidebanner);
