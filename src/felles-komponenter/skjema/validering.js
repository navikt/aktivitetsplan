import React from 'react';
import { FormattedMessage } from 'react-intl';
import { rules } from 'react-redux-form-validation';

export function pakrevd(errorMessageId) {
    return v => (v ? null : <FormattedMessage id={errorMessageId} />);
}

export function maksLengde(errorMessageId, maksimalLengde) {
    return rules.maxLength(
        maksimalLengde,
        <FormattedMessage
            id={errorMessageId}
            values={{
                maksLengde: maksimalLengde,
                MAKS_LENGDE: maksimalLengde,
            }}
        />
    );
}
