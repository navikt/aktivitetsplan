import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import { toggleAktivitetsType } from './filter-reducer';
import { selectAktivitetTyperFilter } from './filter-selector';
import { selectAlleAktiviter } from '../../aktivitet/aktivitetliste-selector';

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

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);
    const aktivitetTyperFilter = selectAktivitetTyperFilter(state);
    const aktivitetTyper = aktiviteter.reduce((typer, aktivitet) => {
        const type = aktivitet.type;
        typer[type] = aktivitetTyperFilter[type]; // eslint-disable-line no-param-reassign
        return typer;
    }, {});

    return {
        aktivitetTyper,
        harAktivitetTyper: Object.keys(aktivitetTyper).length > 1,
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
