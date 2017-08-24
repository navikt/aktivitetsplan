import React from 'react';
import PT from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function TypeFilter({
    harAktivitetTyper,
    aktivitetTyper,
    doToggleAktivitetsType,
}) {
    return (
        <VisibleIfDiv visible={harAktivitetTyper}>
            <Undertittel>
                <FormattedMessage id="filter.aktivitet.type.tittel" />
            </Undertittel>
            {Object.keys(aktivitetTyper).map(aktivitetType =>
                <Checkbox
                        key={aktivitetType}
                        label={
                        <FormattedMessage
                        id={`aktivitet.type.${aktivitetType}`.toLowerCase()}
                        />
                    }
                    onChange={() => doToggleAktivitetsType(aktivitetType)}
                    checked={aktivitetTyper[aktivitetType]}
                />
            )}
        </VisibleIfDiv>
    );
}

TypeFilter.propTypes = {
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.object.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
};

export default TypeFilter;
