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
import { selectRouteParams } from '../../../routing';
import {
    selectAktivitetListeStatus,
    selectAktivitetMedId,
} from '../aktivitetliste-selector';
import PubliserReferat from './publiser-referat';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';

const FullforAktivitet = ({ valgtAktivitet, lagrer, doAvsluttOppfolging }) => {
    const headerTekst = (
        <FormattedMessage id="opprett-begrunnelse.fullfoert.header" />
    );
    const beskrivelseTekst = (
        <FormattedMessage id="opprett-begrunnelse.fullfoert.melding" />
    );

    const begrunnelse = (
        <BegrunnelseAktivitet
            aktivitet={valgtAktivitet}
            headerTekst={headerTekst}
            beskrivelseTekst={beskrivelseTekst}
            lagrer={lagrer}
            onSubmit={beskrivelseForm => {
                doAvsluttOppfolging(
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
                doAvsluttOppfolging(valgtAktivitet, null);
                history.goBack();
            }}
        />
    );

    return (
        <Modal
            header={<ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />}
            contentLabel="fullfor-aktivitet"
        >
            <PubliserReferat aktivitet={valgtAktivitet}>
                {valgtAktivitet.avtalt ? begrunnelse : advarsel}
            </PubliserReferat>
        </Modal>
    );
};

FullforAktivitet.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    lagrer: PT.bool.isRequired,
    doAvsluttOppfolging: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    doAvsluttOppfolging: (aktivitet, begrunnelse) =>
        dispatch(fullforAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = (state, props) => {
    const aktivitetId = selectRouteParams(props).id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);
    return {
        valgtAktivitet: valgtAktivitet || {},
        lagrer: selectAktivitetListeStatus(state) !== STATUS.OK,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullforAktivitet);
