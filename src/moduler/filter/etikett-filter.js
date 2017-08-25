import React from 'react';
import PT from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function EtikettFilter({
    harAktivitetEtiketter,
    aktivitetEtiketter,
    doToggleAktivitetsEtikett,
}) {
    return (
        <VisibleIfDiv visible={harAktivitetEtiketter}>
            <Undertittel>
                <FormattedMessage id="filter.aktivitet.etikett.tittel" />
            </Undertittel>
            {Object.keys(aktivitetEtiketter).map(aktivitetEtikett =>
                <Checkbox
                    key={aktivitetEtikett}
                    label={
                        <FormattedMessage id={`etikett.${aktivitetEtikett}`} />
                    }
                    onChange={() => doToggleAktivitetsEtikett(aktivitetEtikett)}
                    checked={aktivitetEtiketter[aktivitetEtikett]}
                />
            )}
        </VisibleIfDiv>
    );
}

EtikettFilter.propTypes = {
    harAktivitetEtiketter: PT.bool.isRequired,
    aktivitetEtiketter: PT.object.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
};

export default EtikettFilter;
