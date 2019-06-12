import React from 'react';
import PT from 'prop-types';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Textarea as NavFrontendTextarea } from 'nav-frontend-skjema';
import Text from '../../../text';

function getTellerTekst(antallTegn, maxLength, visTellerFra) {
    const tegnIgjen = maxLength - antallTegn;
    const tegnForMange = antallTegn - maxLength;
    const tellerFra = visTellerFra || maxLength / 10;

    if (tegnForMange > 0) {
        return (
            <FormattedMessage
                id="tekstfelt.antalltegn.for-mange"
                values={{ antall: `${tegnForMange}` }}
            />
        );
    } if (tegnIgjen <= tellerFra) {
        return (
            <FormattedMessage
                id="tekstfelt.antalltegn.flere-igjen"
                values={{ antall: `${tegnIgjen}` }}
            />
        );
    }
    return <span>&nbsp;</span>;
}

function InnerTextAreaComponent({
    input,
    labelId,
    placeholderId,
    maxLength,
    errorMessage,
    visTellerFra,
    intl,
    meta, // eslint-disable-line no-unused-vars
    ...rest
}) {
    const placeholder =
        placeholderId &&
        intl.formatMessage({
            id: placeholderId,
        });

    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;

    return (
        <NavFrontendTextarea
            textareaClass="skjemaelement__input input--fullbredde"
            label={labelId && <Text id={labelId} />}
            maxLength={maxLength}
            feil={feil}
            placeholder={placeholder}
            tellerTekst={antallTegn =>
                getTellerTekst(antallTegn, maxLength, visTellerFra)}
            {...input}
            {...rest}
        />
    );
}
InnerTextAreaComponent.propTypes = {
    labelId: PT.string,
    placeholderId: PT.string,
    maxLength: PT.number.isRequired,
    errorMessage: PT.arrayOf(PT.oneOfType([PT.string, PT.node])),
    visTellerFra: PT.number,
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    input: PT.object, // eslint-disable-line react/forbid-prop-types
    intl: intlShape.isRequired,
};

InnerTextAreaComponent.defaultProps = {
    errorMessage: undefined,
    meta: undefined,
    input: undefined,
    visTellerFra: undefined,
    labelId: undefined,
    placeholderId: undefined,
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
    feltNavn: PT.string,
    visTellerFra: PT.number,
};

Textarea.defaultProps = {
    feltNavn: undefined,
    visTellerFra: 0,
};

// NB: testet med <FormatedMessage> + lamda, men det fungerte ikke bra i forms
export default injectIntl(Textarea);
