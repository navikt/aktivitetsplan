import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-for-ferdig-avtalt-aktivitet';
import VisAdvarsel from './vis-advarsel';
import { avbrytAktivitet } from '../../ducks/aktiviteter';
import { STATUS } from '../../ducks/utils';
import StandardModal from '../modal-standard';
import history from '../../history';

const AvbruttAktivitet = (props) => {
    const paramsId = props.params.id;
    const valgtAktivitet = props.aktiviteter.data.find((aktivitet) => aktivitet.id === paramsId) || {};

    const begrunnelse = (<BegrunnelseAktivitet
        headerTekst={<FormattedMessage id="opprett-begrunnelse.avbrutt.header" />}
        beskrivelseTekst={<FormattedMessage id="opprett-begrunnelse.avbrutt.melding" />}
        lagrer={props.aktiviteter.status !== STATUS.OK}
        onSubmit={(beskrivelseForm) => {
            props.lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
            history.goBack();
        }}
    />);

    const advarsel = (<VisAdvarsel
        headerTekst={<FormattedMessage id="advarsel.avbrutt.header" />}
        onSubmit={() => {
            props.lagreBegrunnelse(valgtAktivitet, null);
            history.goBack();
        }}
    />);


    return (
        <StandardModal name="BegrunnelseModal">
            {valgtAktivitet.avtalt ? begrunnelse : advarsel}
        </StandardModal>
    );
};

AvbruttAktivitet.propTypes = {
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet)
    }).isRequired,
    params: PT.shape({ id: PT.string }).isRequired,
    lagreBegrunnelse: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) => dispatch(avbrytAktivitet(aktivitet, begrunnelse))
});

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter
});

export default connect(mapStateToProps, mapDispatchToProps)(AvbruttAktivitet);
