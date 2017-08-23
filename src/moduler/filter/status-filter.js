import React from 'react';
import PT from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function StatusFilter({
    harAktivitetStatus,
    aktivitetStatus,
    doToggleAktivitetsStatus,
}) {
    return (
        <VisibleIfDiv visible={harAktivitetStatus}>
            <Undertittel>
                <FormattedMessage id="filter.aktivitet.status.tittel" />
            </Undertittel>
            {Object.keys(aktivitetStatus).map(status =>
                <Checkbox
                    key={status}
                    label={
                        <FormattedMessage
                            id={`aktivitetstavle.${status
                                .split('_')
                                .join('')
                                .toLowerCase()}`}
                        />
                    }
                    onChange={() => doToggleAktivitetsStatus(status)}
                    checked={aktivitetStatus[status]}
                />
            )}
        </VisibleIfDiv>
    );
}

StatusFilter.propTypes = {
    harAktivitetStatus: PT.bool.isRequired,
    aktivitetStatus: PT.object.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
};

export default StatusFilter;
