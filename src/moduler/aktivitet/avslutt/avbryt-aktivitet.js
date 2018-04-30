import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as AppPT from '../../../proptypes';
import BegrunnelseAktivitet from './begrunnelse-for-ferdig-avtalt-aktivitet';
import VisAdvarsel from './vis-advarsel';
import { avbrytAktivitet } from '../aktivitet-actions';
import { STATUS } from '../../../ducks/utils';
import history from '../../../history';
import {
    selectAktivitetListeStatus,
    selectAktivitetMedId,
} from '../aktivitetliste-selector';
import PubliserReferat from './publiser-referat';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { STATUS_AVBRUTT } from '../../../constant';
import { trengerBegrunnelse } from '../aktivitet-util';

const AvbrytAktivitet = ({ lagrer, valgtAktivitet, lagreBegrunnelse }) => {
    const begrunnelse = (
        <BegrunnelseAktivitet
            aktivitet={valgtAktivitet}
            headerTekst={
                <FormattedMessage id="opprett-begrunnelse.avbrutt.header" />
            }
            beskrivelseTekstId="opprett-begrunnelse.avbrutt.melding"
            lagrer={lagrer}
            onSubmit={beskrivelseForm => {
                lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
                history.replace('/');
            }}
        />
    );

    const advarsel = (
        <VisAdvarsel
            headerTekst={<FormattedMessage id="advarsel.avbrutt.header" />}
            onSubmit={() => {
                lagreBegrunnelse(valgtAktivitet, null);
                history.replace('/');
            }}
        />
    );

    const maaBegrunnes = trengerBegrunnelse(
        valgtAktivitet.avtalt,
        STATUS_AVBRUTT,
        valgtAktivitet.type
    );

    return (
        <Modal
            header={<ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />}
            contentLabel="avbryt-aktivitet"
        >
            <PubliserReferat
                aktivitet={valgtAktivitet}
                nyStatus={STATUS_AVBRUTT}
            >
                {maaBegrunnes ? begrunnelse : advarsel}
            </PubliserReferat>
        </Modal>
    );
};

AvbrytAktivitet.propTypes = {
    aktivitetId: PT.string.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    lagrer: PT.bool.isRequired,
    lagreBegrunnelse: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    lagreBegrunnelse: (aktivitet, begrunnelse) =>
        dispatch(avbrytAktivitet(aktivitet, begrunnelse)),
});

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);
    return {
        valgtAktivitet: valgtAktivitet || {},
        lagrer: selectAktivitetListeStatus(state) !== STATUS.OK,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AvbrytAktivitet);
