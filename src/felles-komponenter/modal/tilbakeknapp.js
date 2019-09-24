import React from 'react';
import PT from 'prop-types';
import { VenstreChevron } from 'nav-frontend-chevron';
import Lenke from '../utils/lenke';

function Tilbakeknapp(props) {
    const { tekst, onClick } = props;
    return (
        <Lenke href="/" onClick={onClick} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">{tekst}</span>
            </div>
        </Lenke>
    );
}

Tilbakeknapp.defaultProps = {
    onClick: undefined
};

Tilbakeknapp.propTypes = {
    tekst: PT.string.isRequired,
    onClick: PT.func
};

export default Tilbakeknapp;
