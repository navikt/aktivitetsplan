import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import hiddenIfHOC from '../felles-komponenter/hidden-if/hidden-if';

function TallAlert({ children }) {
    return (
        <span className="tall-alert">
            <span aria-hidden="true">
                {children}
            </span>
            <span className="kun-for-skjermleser">
                <FormattedMessage
                    id="tall-alert.antall.skjermleser"
                    values={{ ULESTE_MELDINGER: children }}
                />
            </span>
        </span>
    );
}

TallAlert.propTypes = {
    children: PT.number,
};

TallAlert.defaultProps = {
    children: undefined,
};

export default hiddenIfHOC(TallAlert);
