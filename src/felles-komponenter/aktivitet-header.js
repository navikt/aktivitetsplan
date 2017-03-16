import React, { PropTypes as PT } from 'react';
import ModalHeader from './modal-header';

function AktivitetHeader({ aktivitetType }) {
    return (
        <div>
            <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
            <h1 className="typo-undertittel">Planlagt / {aktivitetType}</h1>
        </div>
    );
}

AktivitetHeader.propTypes = {
    aktivitetType: PT.string.isRequired
};


export default AktivitetHeader;
