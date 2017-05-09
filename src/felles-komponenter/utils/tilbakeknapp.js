import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { VenstreChevron } from 'nav-frontend-chevron';
import history from '../../history';
import { TILBAKE_MODAL } from '../../ducks/modal';

function Tilbakeknapp(props) {
    function tilbake(e) {
        e.preventDefault();
        const dialogTekst = props.intl.formatMessage({ id: 'aktkivitet-skjema.lukk-advarsel' });
        if (!props.visConfirmDialog || confirm(dialogTekst)) { // eslint-disable-line no-alert
            props.tilbakeModal();
            history.goBack();
        }
    }

    return (
        <Link href="/" onClick={tilbake} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">
                    <FormattedMessage id={props.tekstId} values={props.tekstValues} />
                </span>
            </div>
        </Link>
    );
}


Tilbakeknapp.defaultProps = {
    tekstValues: undefined,
    visConfirmDialog: false
};

Tilbakeknapp.propTypes = {
    tekstId: PT.string.isRequired,
    tekstValues: PT.object, // eslint-disable-line react/forbid-prop-types
    tilbakeModal: PT.func.isRequired,
    visConfirmDialog: PT.bool,
    intl: intlShape.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    tilbakeModal: () => dispatch({ type: TILBAKE_MODAL })
});

export default connect(null, mapDispatchToProps)(injectIntl(Tilbakeknapp));
