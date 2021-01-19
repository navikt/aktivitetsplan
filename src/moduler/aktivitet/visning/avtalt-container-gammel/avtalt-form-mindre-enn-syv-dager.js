import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import visibleIfHOC from '../../../../hocs/visible-if';

function AvtaltFormMindreEnnSyvDager() {
    return (
        <AlertStripeInfo>
            <FormattedMessage id="sett-til-avtalt-mindre-enn-syv-dager" />
        </AlertStripeInfo>
    );
}

export default visibleIfHOC(AvtaltFormMindreEnnSyvDager);
