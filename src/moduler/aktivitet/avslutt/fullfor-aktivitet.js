import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-for-ferdig-avtalt-aktivitet';
import { fullforAktivitet } from '../aktivitet-actions';
import { STATUS } from '../../../ducks/utils';
import history from '../../../history';
import VisAdvarsel from './vis-advarsel';
import {
    selectAktivitetListeStatus,
    selectAktivitetMedId,
} from '../aktivitetliste-selector';
import PubliserReferat from './publiser-referat';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';

const FullforAktivitet = ({ valgtAktivitet, lagrer, doAvsluttOppfolging }) => {
    const headerTekst = (
        <FormattedMessage id="opprett-begrunnelse.fullfoert.header" />
    );
    const beskrivelseTekstId = 'opprett-begrunnelse.fullfoert.melding';

    const begrunnelse = (
        <BegrunnelseAktivitet
            aktivitet={valgtAktivitet}
            headerTekst={headerTekst}
            beskrivelseTekstId={beskrivelseTekstId}
            lagrer={lagrer}
            onSubmit={beskrivelseForm => {
                doAvsluttOppfolging(
                    valgtAktivitet,
                    beskrivelseForm.begrunnelse
                );
                history.replace('/');
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                doAvsluttOppfolging(valgtAktivitet, null);
                history.replace('/');
            }}
        />
    );

    return (
        <Modal header={<ModalHeader />} contentLabel="fullfor-aktivitet">
            <PubliserReferat aktivitet={valgtAktivitet}>
                {valgtAktivitet.avtalt &&
                valgtAktivitet.type !== SAMTALEREFERAT_TYPE &&
                valgtAktivitet.type !== MOTE_TYPE
                    ? begrunnelse
                    : advarsel}
            </PubliserReferat>
        </Modal>
    );
};

FullforAktivitet.propTypes = {
    aktivitetId: PT.string.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    lagrer: PT.bool.isRequired,
    doAvsluttOppfolging: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    doAvsluttOppfolging: (aktivitet, begrunnelse) =>
        dispatch(fullforAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);
    return {
        valgtAktivitet: valgtAktivitet || {},
        lagrer: selectAktivitetListeStatus(state) !== STATUS.OK,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullforAktivitet);
