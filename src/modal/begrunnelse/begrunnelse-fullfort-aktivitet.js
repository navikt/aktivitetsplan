import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-aktivitet';
import { fullforAktivitet } from '../../ducks/aktiviteter';
import { STATUS } from '../../ducks/utils';

const BegrunnelseFullfortAktivitet = (props) => {
    const headerTekst = <FormattedMessage id="opprett-begrunnelse.fullfoert.header" />;
    const beskrivelseTekst = <FormattedMessage id="opprett-begrunnelse.fullfoert.melding" />;
    const paramsId = props.params.id;
    const valgtAktivitet = props.aktiviteter.data.find((aktivitet) => aktivitet.id === paramsId) || {};

    return (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseTekst={beskrivelseTekst}
            lagrer={this.props.aktiviteter.status !== STATUS.OK}
            onLagre={(begrunnelse) => props.lagreBegrunnelse(valgtAktivitet, begrunnelse)}
        />
    );
};

BegrunnelseFullfortAktivitet.propTypes = {
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet)
    }).isRequired,
    params: PT.shape({ id: PT.string }).isRequired,
    lagreBegrunnelse: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) => dispatch(fullforAktivitet(aktivitet, begrunnelse))
});

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter
});

export default connect(mapStateToProps, mapDispatchToProps)(BegrunnelseFullfortAktivitet);
