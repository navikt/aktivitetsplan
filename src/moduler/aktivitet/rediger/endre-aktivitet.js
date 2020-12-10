import PT from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../constant';
import { STATUS } from '../../../ducks/utils';
import { CONFIRM, useConfirmOnBeforeUnload } from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import { aktivitetRoute } from '../../../routes';
import { removeEmptyKeysFromObject } from '../../../utils/object';
import { oppdaterAktivitet } from '../aktivitet-actions';
import BehandlingAktivitetForm from '../aktivitet-forms/behandling/aktivitet-behandling-form';
import EgenAktivitetForm from '../aktivitet-forms/egen/aktivitet-egen-form';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/aktivitet-ijobb-form';
import MoteAktivitetForm from '../aktivitet-forms/mote/mote-aktivitet-form';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/samtalereferat-form';
import SokeavtaleAktivitetForm from '../aktivitet-forms/sokeavtale/aktivitet-sokeavtale-form';
import StillingAktivitetForm from '../aktivitet-forms/stilling/aktivitet-stilling-form';
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
