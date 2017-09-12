import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

function SelectMedTittel({ keyValueObject, tekstId, fieldNavn }) {
    return (
        <div>
            <Normaltekst className="blokk-s">
                <FormattedMessage id={tekstId} />
            </Normaltekst>
            <Field name={fieldNavn} component="select" className="blokk-s">
                {Object.entries(keyValueObject).map(([key, value]) =>
                    <option value={key}>
                        {value}
                    </option>
                )}
            </Field>
        </div>
    );
}

export default SelectMedTittel;
