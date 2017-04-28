import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import * as AppPT from '../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-aktivitet';
import { fullforAktivitet } from '../../ducks/aktiviteter';

const BegrunnelseFullfortAktivitet = (props) => {
    const headerTekst = <span>Begrunnelse for fullført aktivitet</span>;
    const beskrivelseTekst = <span>Aktiviteteter med denne lilvsløpstatus kan ikke lenger oppdateres og redigeres</span>;
    const valgtAktivitet = props.aktiviteter.find((aktivitet) => aktivitet.id === props.params.id) || {};

    return (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseTekst={beskrivelseTekst}
            lagrer={valgtAktivitet.laster || false}
            onLagre={(begrunnelse) => props.lagreBegrunnelse(valgtAktivitet, begrunnelse)}
        />
    );
};

BegrunnelseFullfortAktivitet.propTypes = {
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
    params: PT.shape({ id: PT.string }).isRequired,
    lagreBegrunnelse: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) => dispatch(fullforAktivitet(aktivitet, begrunnelse))
});

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter.data
});

export default connect(mapStateToProps, mapDispatchToProps)(BegrunnelseFullfortAktivitet);
