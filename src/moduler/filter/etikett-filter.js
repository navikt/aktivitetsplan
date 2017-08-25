import React from 'react';
import PT from 'prop-types';
import {connect} from "react-redux";
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import {toggleAktivitetsEtikett} from "./filter-reducer";
import {selectAktivitetEtiketterFilter} from "./filter-selector";
import {selectAlleAktiviter} from "../aktivitet/aktivitetliste-selector";


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

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const aktivitetEtiketterFilter = selectAktivitetEtiketterFilter(state);
    const aktivitetEtiketter = aktiviteter.reduce((etiketter, aktivitet) => {
        const etikett = aktivitet.etikett;
        if (etikett) {
            etiketter[etikett] = aktivitetEtiketterFilter[etikett]; // eslint-disable-line no-param-reassign
        }
        return etiketter;
    }, {});

    return {
        aktivitetEtiketter,
        harAktivitetEtiketter: Object.keys(aktivitetEtiketter).length > 1,
    };
};


const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsEtikett: aktivitetsType =>
        dispatch(toggleAktivitetsEtikett(aktivitetsType)),
});


export default connect(mapStateToProps, mapDispatchToProps)(EtikettFilter);
