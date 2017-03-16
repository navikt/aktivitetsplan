import React, { PropTypes as PT } from 'react';
import { Link } from 'react-router';
import { VenstreChevron } from './chevron';
import history from '../history';


function Tilbakeknapp({ children }) {
    function tilbake() {
        history.goBack();
    }

    return (
        <Link href="/" onClick={tilbake}>
            <VenstreChevron />
            {children}
        </Link>
    );
}

Tilbakeknapp.propTypes = {
    children: PT.node.isRequired
};

export default Tilbakeknapp;
