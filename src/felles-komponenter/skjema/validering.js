import React from 'react';
import { FormattedMessage } from 'react-intl';
import { rules } from 'react-redux-form-validation';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../constant';

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

export function validerReferatPublisert() {
    return (ignorerDenne, props) => {
        const aktivitet = props.aktivitet || {};
        const { type, erReferatPublisert } = aktivitet;
        const manglerReferat =
            !type ||
            ((type === MOTE_TYPE || type === SAMTALEREFERAT_TYPE) &&
                !erReferatPublisert);
        return (
            manglerReferat &&
            <FormattedMessage id="referat.validering.ikke-publisert" />
        );
    };
}
