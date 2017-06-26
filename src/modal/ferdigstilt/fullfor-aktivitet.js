import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-for-ferdig-avtalt-aktivitet';
import { fullforAktivitet } from '../../ducks/aktiviteter';
import { STATUS } from '../../ducks/utils';
import StandardModal from '../modal-standard';
import history from '../../history';
import VisAdvarsel from './vis-advarsel';

const FullforAktivitet = props => {
    const headerTekst = (
        <FormattedMessage id="opprett-begrunnelse.fullfoert.header" />
    );
    const beskrivelseTekst = (
        <FormattedMessage id="opprett-begrunnelse.fullfoert.melding" />
    );
    const paramsId = props.params.id;
    const valgtAktivitet = props.aktiviteter.data.find(
        aktivitet => aktivitet.id === paramsId
    ) || {};

    const begrunnelse = (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseTekst={beskrivelseTekst}
            lagrer={props.aktiviteter.status !== STATUS.OK}
            onSubmit={beskrivelseForm => {
                props.doAvsluttOppfolging(
                    valgtAktivitet,
                    beskrivelseForm.begrunnelse
                );
                history.goBack();
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                props.doAvsluttOppfolging(valgtAktivitet, null);
                history.goBack();
            }}
        />
    );

    return (
        <StandardModal name="FullfortModal">
            {valgtAktivitet.avtalt ? begrunnelse : advarsel}
        </StandardModal>
    );
};

FullforAktivitet.propTypes = {
    aktiviteter: PT.shape({
        status: PT.string,
        data: PT.arrayOf(AppPT.aktivitet),
    }).isRequired,
    params: PT.shape({ id: PT.string }).isRequired,
    doAvsluttOppfolging: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    doAvsluttOppfolging: (aktivitet, begrunnelse) =>
        dispatch(fullforAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = state => ({
    aktiviteter: state.data.aktiviteter,
});

export default connect(mapStateToProps, mapDispatchToProps)(FullforAktivitet);
