import React from 'react';
import PT from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import classNames from 'classnames';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import loggEvent from '../../../felles-komponenter/utils/logging';

const filterClassNames = className => classNames(className, 'filter');

function FilterVisningsKomponent({
    harAktiviteter,
    filter,
    filterTittel,
    filterTekst,
    metrikkNavn,
    doToggleFunction,
    className,
}) {
    return (
        <VisibleIfDiv
            visible={harAktiviteter}
            className={filterClassNames(className)}
        >
            <Undertittel className="filter__tittel">
                <FormattedMessage id={filterTittel} />
            </Undertittel>
            {Object.keys(filter).map(nokkel =>
                <Checkbox
                    key={nokkel}
                    label={
                        <FormattedMessage
                            id={filterTekst + nokkel.toLowerCase()}
                        />
                    }
                    onChange={() => {
                        if (!filter[nokkel] && metrikkNavn) {
                            loggEvent(metrikkNavn, { filter: nokkel });
                        }
                        doToggleFunction(nokkel);
                    }}
                    checked={filter[nokkel]}
                />
            )}
        </VisibleIfDiv>
    );
}

FilterVisningsKomponent.defaultProps = {
    className: '',
};

FilterVisningsKomponent.propTypes = {
    harAktiviteter: PT.bool.isRequired,
    filter: PT.object.isRequired,
    filterTittel: PT.string.isRequired,
    filterTekst: PT.string.isRequired,
    doToggleFunction: PT.func.isRequired,
    metrikkNavn: PT.string.isRequired,
    className: PT.string,
};

export default FilterVisningsKomponent;
