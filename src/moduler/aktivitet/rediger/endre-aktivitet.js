import PT from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';

import { STATUS } from '../../../api/utils';
import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import Innholdslaster from '../../../felles-komponenter/utils/Innholdslaster';
import * as AppPT from '../../../proptypes';
import { aktivitetRoute } from '../../../routes';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import { oppdaterAktivitet } from '../aktivitet-actions';
import BehandlingAktivitetForm from '../aktivitet-forms/behandling/AktivitetBehandlingForm';
import EgenAktivitetForm from '../aktivitet-forms/egen/AktivitetEgenForm';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/AktivitetIjobbForm';
import MoteAktivitetForm from '../aktivitet-forms/mote/MoteAktivitetForm';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/SamtalereferatForm';
import SokeavtaleAktivitetForm from '../aktivitet-forms/sokeavtale/AktivitetSokeavtaleForm';
import StillingAktivitetForm from '../aktivitet-forms/stilling/AktivitetStillingForm';
import { selectAktivitetFeilmeldinger, selectAktivitetStatus } from '../aktivitet-selector';
import { selectAktivitetMedId } from '../aktivitetlisteSelector';

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

function EndreAktivitet(props) {
    const { valgtAktivitet, avhengigheter, history, doOppdaterAktivitet, lagrer, aktivitetFeilmeldinger } = props;

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);

    function oppdater(aktivitet) {
        const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
        const oppdatertAktivitet = { ...valgtAktivitet, ...filteredAktivitet };
        return doOppdaterAktivitet(oppdatertAktivitet).then(() => history.push(aktivitetRoute(valgtAktivitet.id)));
    }

    const onReqClose = () => {
        if (!isDirty.current || window.confirm(CONFIRM)) {
            history.push('/');
        }
    };

    const onReqBack = (e) => {
        e.preventDefault();
        if (!isDirty.current || window.confirm(CONFIRM)) {
            history.goBack();
        }
    };

    const header = <ModalHeader tilbakeTekst="Tilbake" onTilbakeClick={onReqBack} />;

    const formProps = {
        aktivitet: valgtAktivitet,
        onSubmit: oppdater,
        endre: true,
        isDirtyRef: isDirty,
        lagrer,
    };

    const Form = getAktivitetsFormComponent(valgtAktivitet);
    const AktivitetForm = Form ? <Form {...formProps} /> : null;

    return (
        <Modal
            header={header}
            feilmeldinger={aktivitetFeilmeldinger}
            onRequestClose={onReqClose}
            contentLabel="aktivitet-modal"
        >
            <article>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>{AktivitetForm}</ModalContainer>
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
    aktivitetFeilmeldinger: PT.array.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    history: AppPT.history.isRequired,
    match: PT.object.isRequired,
};

const mapStateToProps = (state, props) => {
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);
    return {
        valgtAktivitet,
        avhengigheter: [valgtAktivitet ? STATUS.OK : STATUS.PENDING],
        aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
        lagrer: selectAktivitetStatus !== STATUS.OK,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doOppdaterAktivitet: (aktivitet) => oppdaterAktivitet(aktivitet)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndreAktivitet);
