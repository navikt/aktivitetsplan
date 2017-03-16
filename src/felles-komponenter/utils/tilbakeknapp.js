import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { VenstreChevron } from './chevron';
import history from '../../history';


function Tilbakeknapp() {
    function tilbake() {
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

export default Tilbakeknapp;
