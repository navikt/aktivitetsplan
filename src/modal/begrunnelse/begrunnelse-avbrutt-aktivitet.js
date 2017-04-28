import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-aktivitet';
import { avbrytAktivitet } from '../../ducks/aktiviteter';

const BegrunnelseAvbruttAktivitet = (props) => {
    const headerTekst = <FormattedMessage id="opprett-begrunnelse.avbrutt.header" />;
    const beskrivelseTekst = <FormattedMessage id="opprett-begrunnelse.avbrutt.melding" />;
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

BegrunnelseAvbruttAktivitet.propTypes = {
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
    params: PT.shape({ id: PT.string }).isRequired,
    lagreBegrunnelse: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) => dispatch(avbrytAktivitet(aktivitet, begrunnelse))
});

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter.data
});

export default connect(mapStateToProps, mapDispatchToProps)(BegrunnelseAvbruttAktivitet);
