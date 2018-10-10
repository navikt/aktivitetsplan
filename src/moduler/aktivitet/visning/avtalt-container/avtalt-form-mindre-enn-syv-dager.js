import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';

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

export default AvtaltFormMindreEnnSyvDager;
