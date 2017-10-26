import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import { oppdaterAktivitet } from '../aktivitet-actions';
import * as AppPT from '../../../proptypes';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import StillingAktivitetForm, {
    formNavn as stillingFormNavn,
} from '../aktivitet-forms/stilling/aktivitet-stilling-form';
import EgenAktivitetForm, {
    formNavn as egenFormNavn,
} from '../aktivitet-forms/egen/aktivitet-egen-form';
import SokeavtaleAktivitetForm, {
    formNavn as sokeavtaleFormNavn,
} from '../aktivitet-forms/sokeavtale/aktivitet-sokeavtale-form';
import BehandlingAktivitetForm, {
    formNavn as behandlingFormNavn,
} from '../aktivitet-forms/behandling/aktivitet-behandling-form';
import MoteAktivitetForm, {
    formNavn as moteFormNavn,
} from '../aktivitet-forms/mote/mote-aktivitet-form';
import SamtalereferatForm, {
    formNavn as samtalereferatFormNavn,
} from '../aktivitet-forms/samtalereferat/samtalereferat-form';
import IJobbAktivitetForm, {
    formNavn as ijobbFormNavn,
} from '../aktivitet-forms/ijobb/aktivitet-ijobb-form';
import history from '../../../history';
import {
    EGEN_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    BEHANDLING_AKTIVITET_TYPE,
    SAMTALEREFERAT_TYPE,
    MOTE_TYPE,
    IJOBB_AKTIVITET_TYPE,
} from '../../../constant';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import Modal from '../../../felles-komponenter/modal/modal';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { aktivitetRoute } from '../../../routing';
import { STATUS } from '../../../ducks/utils';
import { selectAktivitetMedId } from '../aktivitetliste-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';

function EndreAktivitetForm({
    valgtAktivitet,
    lagrer,
    doOppdaterAktivitet,
    visAktivitet,
}) {
    function oppdater(aktivitetData) {
        const oppdatertAktivitet = { ...valgtAktivitet, ...aktivitetData };
        doOppdaterAktivitet(oppdatertAktivitet).then(visAktivitet);
    }

    switch (valgtAktivitet.type) {
        case STILLING_AKTIVITET_TYPE:
            return (
                <StillingAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        case EGEN_AKTIVITET_TYPE:
            return (
                <EgenAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        case SOKEAVTALE_AKTIVITET_TYPE:
            return (
                <SokeavtaleAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        case BEHANDLING_AKTIVITET_TYPE:
            return (
                <BehandlingAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        case MOTE_TYPE:
            return (
                <MoteAktivitetForm
                    aktivitet={valgtAktivitet}
                    lagrer={lagrer}
                    onSubmit={oppdater}
                />
            );
        case SAMTALEREFERAT_TYPE:
            return (
                <SamtalereferatForm
                    aktivitet={valgtAktivitet}
                    lagrer={lagrer}
                    onSubmit={oppdater}
                />
            );
        case IJOBB_AKTIVITET_TYPE:
            return (
                <IJobbAktivitetForm
                    aktivitet={valgtAktivitet}
                    onSubmit={oppdater}
                />
            );
        default:
            return null;
    }
}

EndreAktivitetForm.propTypes = {
    valgtAktivitet: AppPT.aktivitet,
    doOppdaterAktivitet: PT.func.isRequired,
    visAktivitet: PT.func.isRequired,
    lagrer: PT.bool.isRequired,
};

EndreAktivitetForm.defaultProps = {
    valgtAktivitet: undefined,
};

function EndreAktivitet({
    valgtAktivitet,
    intl,
    lukkModal,
    formIsDirty,
    avhengigheter,
    ...rest
}) {
    function visAktivitet() {
        history.push(aktivitetRoute(valgtAktivitet.id));
    }

    return (
        <Modal
            key="endreAktivitetModal"
            header={
                <ModalHeader
                    tilbakeTekstId="endre-aktivitet.tilbake"
                    visConfirmDialog={formIsDirty}
                />
            }
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });
                // eslint-disable-next-line no-alert
                if (!formIsDirty || confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
            contentLabel="aktivitet-modal"
        >
            <article
                className="egen-aktivitet"
                aria-labelledby="modal-egen-aktivitet-header"
            >
                <Innholdslaster avhengigheter={avhengigheter}>
                    <ModalContainer>
                        <EndreAktivitetForm
                            valgtAktivitet={valgtAktivitet}
                            visAktivitet={visAktivitet}
                            {...rest}
                        />
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
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);
    const formNavn =
        valgtAktivitet &&
        {
            [STILLING_AKTIVITET_TYPE]: stillingFormNavn,
            [EGEN_AKTIVITET_TYPE]: egenFormNavn,
            [SOKEAVTALE_AKTIVITET_TYPE]: sokeavtaleFormNavn,
            [BEHANDLING_AKTIVITET_TYPE]: behandlingFormNavn,
            [MOTE_TYPE]: moteFormNavn,
            [SAMTALEREFERAT_TYPE]: samtalereferatFormNavn,
            [IJOBB_AKTIVITET_TYPE]: ijobbFormNavn,
        }[valgtAktivitet.type];
    return {
        valgtAktivitet,
        avhengigheter: [valgtAktivitet ? STATUS.OK : STATUS.PENDING],
        formIsDirty: isDirty(formNavn)(state),
        lagrer: selectAktivitetStatus(state) !== STATUS.OK,
    };
};

const mapDispatchToProps = dispatch => ({
    doOppdaterAktivitet: aktivitet => oppdaterAktivitet(aktivitet)(dispatch),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(EndreAktivitet)
);
