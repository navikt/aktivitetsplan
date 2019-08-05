import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { VenstreChevron } from 'nav-frontend-chevron';
import Lenke from './lenke';
import * as AppPT from '../../proptypes';

function Tilbakeknapp({
    visConfirmDialog,
    history,
    tekstId,
    tekstValues,
    intl,
}) {
    function tilbake(e) {
        e.preventDefault();
        const dialogTekst = intl.formatMessage({
            id: 'aktkivitet-skjema.lukk-advarsel',
        });
        // eslint-disable-next-line no-alert
        if (!visConfirmDialog || window.confirm(dialogTekst)) {
            history.goBack();
        }
    }

    return (
        <Lenke href="/" onClick={tilbake} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">
                    <FormattedMessage id={tekstId} values={tekstValues} />
                </span>
            </div>
        </Lenke>
    );
}

Tilbakeknapp.defaultProps = {
    tekstValues: undefined,
    visConfirmDialog: false,
};

Tilbakeknapp.propTypes = {
    tekstId: PT.string.isRequired,
    tekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    visConfirmDialog: PT.bool,
    intl: intlShape.isRequired,
    history: AppPT.history.isRequired,
};

export default withRouter(injectIntl(Tilbakeknapp));
