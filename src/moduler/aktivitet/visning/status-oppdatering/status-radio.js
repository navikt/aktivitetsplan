import React from 'react';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import Radio from '../../../../felles-komponenter/skjema/input/radio';

function StatusRadio({ status, disabled }) {
    return (
        <Radio
            feltNavn="aktivitetstatus"
            label={
                <FormattedMessage
                    id={`aktivitet.status.${status.toLowerCase()}`}
                />
            }
            value={status}
            id={`id--${status}`}
            disabled={disabled}
        />
    );
}

StatusRadio.propTypes = {
    status: PT.string.isRequired,
    disabled: PT.bool.isRequired,
};

export default StatusRadio;
