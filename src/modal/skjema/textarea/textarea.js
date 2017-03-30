import React, {PropTypes as PT} from 'react';
import {CustomField} from 'react-redux-form-validation';
import {FormattedMessage} from 'react-intl';
import NavFrontendTextarea from 'nav-frontend-skjema/src/textarea';


function InnerTextAreaComponent({input, labelId, maxLength}) {
    return (
        <NavFrontendTextarea
            textareaClass="skjemaelement__input input--fullbredde"
            label={<FormattedMessage id={labelId}/>}
            maxLength={maxLength}
            {...input}
        />
    );
}
InnerTextAreaComponent.propTypes = {
    labelId: PT.string.isRequired,
    maxLength: PT.number.isRequired,

    input: PT.object, // eslint-disable-line react/forbid-prop-types
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
};

function Textarea({feltNavn, ...rest}) {
    return (
        <CustomField
            name={feltNavn}
            customComponent={ <InnerTextAreaComponent {...rest}/> }
        />
    );
}

Textarea.propTypes = {
    feltNavn: PT.string.isRequired,
};

export default Textarea;



