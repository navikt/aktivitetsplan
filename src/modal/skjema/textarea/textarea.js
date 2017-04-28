import React, { PropTypes as PT } from 'react';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Textarea as NavFrontendTextarea } from 'nav-frontend-skjema';


function InnerTextAreaComponent({ input, labelId, maxLength, errorMessage, meta, ...rest }) {
    const getFeilmelding = (feilliste) => {
        if (feilliste) {
            return { feilmelding: <div>{ feilliste.map(feil => feil) }</div> };
        }
    };

    return (
        <NavFrontendTextarea
            textareaClass="skjemaelement__input input--fullbredde"
            label={labelId && <FormattedMessage id={labelId} />}
            maxLength={maxLength}
            feil={getFeilmelding(errorMessage)}
            {...input}
            {...rest}
        />
    );
}
InnerTextAreaComponent.propTypes = {
    labelId: PT.string.isRequired,
    maxLength: PT.number.isRequired,

    input: PT.object // eslint-disable-line react/forbid-prop-types
};

function Textarea({ feltNavn, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            customComponent={<InnerTextAreaComponent {...rest} />}
        />
    );
}

Textarea.propTypes = {
    feltNavn: PT.string
};

export default Textarea;

