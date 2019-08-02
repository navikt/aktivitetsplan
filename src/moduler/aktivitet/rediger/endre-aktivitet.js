import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { isDirty } from 'redux-form';
import { oppdaterAktivitet } from '../aktivitet-actions';
import * as AppPT from '../../../proptypes';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { formNavn } from '../aktivitet-forms/aktivitet-form-utils';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import Modal from '../../../felles-komponenter/modal/modal';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { aktivitetRoute } from '../../../routing';
import { STATUS } from '../../../ducks/utils';
import { selectAktivitetMedId } from '../aktivitetliste-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../constant';
import StillingAktivitetForm from '../aktivitet-forms/stilling/aktivitet-stilling-form';
import EgenAktivitetForm from '../aktivitet-forms/egen/aktivitet-egen-form';
import SokeavtaleAktivitetForm from '../aktivitet-forms/sokeavtale/aktivitet-sokeavtale-form';
import BehandlingAktivitetForm from '../aktivitet-forms/behandling/aktivitet-behandling-form';
import MoteAktivitetForm from '../aktivitet-forms/mote/mote-aktivitet-form';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/samtalereferat-form';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/aktivitet-ijobb-form';

function getAktivitetsFormComponent(aktivitet) {
    if (!aktivitet) {
        return null;
    }
    switch (aktivitet.type) {
        case STILLING_AKTIVITET_TYPE:
            return StillingAktivitetForm;
        case EGEN_AKTIVITET_TYPE:
            return EgenAktivitetForm;
        case SOKEAVTALE_AKTIVITET_TYPE:
            return SokeavtaleAktivitetForm;
        case BEHANDLING_AKTIVITET_TYPE:
            return BehandlingAktivitetForm;
        case MOTE_TYPE:
            return MoteAktivitetForm;
        case SAMTALEREFERAT_TYPE:
            return SamtalereferatForm;
        case IJOBB_AKTIVITET_TYPE:
            return IJobbAktivitetForm;
        default:
            return null;
    }
}

function EndreAktivitet({
    valgtAktivitet,
    lukkModal,
    formIsDirty,
    avhengigheter,
    history,
    doOppdaterAktivitet,
    lagrer,
}) {
    function oppdater(aktivitetData) {
        const oppdatertAktivitet = { ...valgtAktivitet, ...aktivitetData };
        return doOppdaterAktivitet(oppdatertAktivitet).then(() =>
            history.push(aktivitetRoute(valgtAktivitet.id))
        );
    }

    const header = (
        <ModalHeader
            tilbakeTekstId="endre-aktivitet.tilbake"
            visConfirmDialog={formIsDirty}
        />
    );

    const onReqClose = () => {
        const dialogTekst =
            'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';
        if (!formIsDirty || window.confirm(dialogTekst)) {
            history.push('/');
            lukkModal();
        }
    };

    const AktivitetForm = getAktivitetsFormComponent(valgtAktivitet);
    const formProps = {
        aktivitet: valgtAktivitet,
        onSubmit: oppdater,
        endre: true,
        lagrer,
    };

    return (
        <Modal
            header={header}
            onRequestClose={onReqClose}
            contentLabel="aktivitet-modal"
        >
            <article>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>
                        {AktivitetForm
                            ? <AktivitetForm {...formProps} />
                            : null}
                    </ModalContainer>
                </Innholdslaster>
            </article>
        </Modal>
    );
}

EndreAktivitet.defaultProps = {
    valgtAktivitet: undefined,
};

EndreAktivitet.propTypes = {
    doOppdaterAktivitet: PT.func.isRequired,
    lagrer: PT.bool.isRequired,
    valgtAktivitet: AppPT.aktivitet,
    aktivitetId: PT.string.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    formIsDirty: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);
    const erArenaAktivitet =
        !!valgtAktivitet &&
        [
            TILTAK_AKTIVITET_TYPE,
            GRUPPE_AKTIVITET_TYPE,
            UTDANNING_AKTIVITET_TYPE,
        ].includes(valgtAktivitet.type);
    const aktivitetDataStatus = erArenaAktivitet
        ? selectArenaAktivitetStatus(state)
        : selectAktivitetStatus(state);
    return {
        valgtAktivitet,
        avhengigheter: [valgtAktivitet ? STATUS.OK : STATUS.PENDING],
        formIsDirty: isDirty(formNavn)(state),
        lagrer: aktivitetDataStatus !== STATUS.OK,
    };
};

const mapDispatchToProps = dispatch => ({
    doOppdaterAktivitet: aktivitet => oppdaterAktivitet(aktivitet)(dispatch),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreAktivitet);
