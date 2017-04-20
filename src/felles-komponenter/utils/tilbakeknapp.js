import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { VenstreChevron } from 'nav-frontend-chevron';
import history from '../../history';


function Tilbakeknapp() {
    function tilbake() {
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

Tilbakeknapp.propTypes = {};

export default Tilbakeknapp;
