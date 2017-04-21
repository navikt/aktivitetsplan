import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { VenstreChevron } from './chevron';
import history from '../../history';
import { TILBAKE_MODAL } from '../../ducks/modal';


function Tilbakeknapp(props) {
    function tilbake() {
        props.tilbakeModal();
        history.goBack();
    }

    return (
        <Link href="/" onClick={tilbake} className="tilbakeknapp">
            <VenstreChevron />
            <FormattedMessage id="aktivitetsplan.tilbakeknapp" />
        </Link>
    );
}

Tilbakeknapp.propTypes = {
};
const mapDispatchToProps = (dispatch) => ({
    tilbakeModal: () => dispatch({ type: TILBAKE_MODAL })
});

export default connect(null, mapDispatchToProps)(Tilbakeknapp);
