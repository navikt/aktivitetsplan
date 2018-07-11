import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SamtalereferatForm from './samtalereferat-form';
import { SAMTALEREFERAT_TYPE } from '../../../../constant';
import { nyAktivitetMedType } from '../ny-aktivitet-util';
import * as AppPT from '../../../../proptypes';

function NyttSamtalereferat({ onLagreNyAktivitet, ...rest }) {
    return <SamtalereferatForm {...rest} onSubmit={onLagreNyAktivitet} />;
}

NyttSamtalereferat.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLagreNyAktivitet: aktivitet =>
        dispatch(
            nyAktivitetMedType(aktivitet, SAMTALEREFERAT_TYPE, ownProps.history)
        ),
});

const mapStateToProps = () => ({});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NyttSamtalereferat)
);
