import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MoteAktivitetForm from './mote-aktivitet-form';
import { MOTE_TYPE } from '../../../../constant';
import { nyAktivitetMedType } from '../ny-aktivitet-util';
import * as AppPT from '../../../../proptypes';

function NyMoteAktivitet({ onLagreNyAktivitet, ...rest }) {
    return <MoteAktivitetForm {...rest} onSubmit={onLagreNyAktivitet} />;
}

NyMoteAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLagreNyAktivitet: aktivitet =>
        dispatch(nyAktivitetMedType(aktivitet, MOTE_TYPE, ownProps.history)),
});

const mapStateToProps = () => ({});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NyMoteAktivitet)
);
