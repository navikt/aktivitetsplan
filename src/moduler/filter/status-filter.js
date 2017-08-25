import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import {selectAktivitetStatusFilter} from "./filter-selector";
import {selectAlleAktiviter} from "../aktivitet/aktivitetliste-selector";
import {
    toggleAktivitetsStatus,
} from './filter-reducer';

function StatusFilter({harAktivitetStatus,aktivitetStatus,doToggleAktivitetsStatus}) {

    return (
        <VisibleIfDiv visible={harAktivitetStatus}>
            <Undertittel>
                <FormattedMessage id="aktivitet.status" />
            </Undertittel>
            {Object.keys(aktivitetStatus).map(status =>
                <Checkbox
                    key={status}
                    label={
                        <FormattedMessage
                            id={`aktivitet.status.${status}`.toLowerCase()}
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

const mapStateToProps = state =>{
    const aktiviteter = selectAlleAktiviter(state);
    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    const aktivitetStatus = aktiviteter.reduce((statusliste, aktivitet) => {
        const status = aktivitet.status;
        statusliste[status] = aktivitetStatusFilter[status]; // eslint-disable-line no-param-reassign
        return statusliste;
    }, {});
    return{
        aktivitetStatus,
        harAktivitetStatus: Object.keys(aktivitetStatus).length > 1,
    }
};


const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusFilter);

