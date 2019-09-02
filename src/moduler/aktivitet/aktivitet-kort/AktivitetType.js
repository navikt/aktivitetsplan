import { Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import React from 'react';

const AktivitetType = ({ type }) =>
    <Undertekst tag="p" className="aktivitetskort__type" data-testid={type}>
        <FormattedMessage id={`aktivitetskort.type.${type}`.toLowerCase()} />
    </Undertekst>;

AktivitetType.propTypes = {
    type: PT.string.isRequired,
};

export default AktivitetType;
