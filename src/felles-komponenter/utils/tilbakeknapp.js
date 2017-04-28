import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { VenstreChevron } from 'nav-frontend-chevron';
import history from '../../history';
import { TILBAKE_MODAL } from '../../ducks/modal';

function Tilbakeknapp(props) {
    function tilbake() {
        props.tilbakeModal();
        history.goBack();
    }

    return (
        <Link href="/" onClick={tilbake} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">
                    <FormattedMessage id="aktivitetsplan.tilbakeknapp" />
                </span>
            </div>
        </Link>
    );
}

Tilbakeknapp.propTypes = {
    tilbakeModal: PT.func.isRequired
};

Tilbakeknapp.propTypes = {};
const mapDispatchToProps = (dispatch) => ({
    tilbakeModal: () => dispatch({ type: TILBAKE_MODAL })
});

export default connect(null, mapDispatchToProps)(Tilbakeknapp);
