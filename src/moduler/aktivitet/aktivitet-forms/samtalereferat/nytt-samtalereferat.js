import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SamtalereferatForm from './samtalereferat-form';
import { SAMTALEREFERAT_TYPE } from '../../../../constant';
import { nyAktivitetMedType } from '../ny-aktivitet-util';

function NyttSamtalereferat({ onLagreNyAktivitet, ...rest }) {
    return <SamtalereferatForm {...rest} onSubmit={onLagreNyAktivitet} />;
}

NyttSamtalereferat.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet =>
        dispatch(nyAktivitetMedType(aktivitet, SAMTALEREFERAT_TYPE)),
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NyttSamtalereferat);
