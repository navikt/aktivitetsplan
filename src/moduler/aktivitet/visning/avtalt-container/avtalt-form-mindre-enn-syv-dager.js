import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import visibleIfHOC from '../../../../hocs/visible-if';

function AvtaltFormMindreEnnSyvDager() {
    return (
        <div>
            <div>
                <AlertStripeInfo>
                    <FormattedMessage
                        id={'sett-til-avtalt-mindre-enn-syv-dager'}
                    />
                </AlertStripeInfo>
            </div>
            <hr className="aktivitetvisning__delelinje" />
        </div>
    );
}

export default visibleIfHOC(AvtaltFormMindreEnnSyvDager);
