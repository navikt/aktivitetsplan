import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import MoteAktivitetForm from './mote-aktivitet-form';
import { MOTE_TYPE } from '../../../../constant';
import { nyAktivitetMedType } from '../ny-aktivitet-util';

function NyMoteAktivitet({ onLagreNyAktivitet, ...rest }) {
    return <MoteAktivitetForm {...rest} onSubmit={onLagreNyAktivitet} />;
}

NyMoteAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet =>
        dispatch(nyAktivitetMedType(aktivitet, MOTE_TYPE)),
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NyMoteAktivitet);
