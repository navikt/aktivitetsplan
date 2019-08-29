import React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import BannerIcon from './banner-icon';
import visibleIf from '../../hocs/visible-if';
import Brodsmuler from '../brodsmuler/brodsmuler';

function Sidebanner() {
    return (
        <div className="sidebanner-container">
            <div className="sidebanner-grid">
                <Brodsmuler />
                <div className="sidebanner">
                    <BannerIcon />
                    <Sidetittel className="sidebanner__tittel">
                        Aktivitetsplan
                    </Sidetittel>
                </div>
            </div>
        </div>
    );
}

export default visibleIf(Sidebanner);
