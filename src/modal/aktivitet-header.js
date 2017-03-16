import React, { PropTypes as PT } from 'react';
import ModalHeader from './modal-header';

function AktivitetHeader() {
    return (
        <div>
            <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
        </div>
    );
}

AktivitetHeader.propTypes = {
    aktivitetType: PT.string.isRequired
};


export default AktivitetHeader;
