import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import history from '../../../history';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import BegrunnelseForm from '../begrunnelse-form';
import { lagreBegrunnelse } from '../innstillinger-reducer';
import InnstillingerModal from '../innstillinger-modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPt from '../../../proptypes';
import hiddenIfHOC from '../../../felles-komponenter/hidden-if/hidden-if';
import { HiddenIfAlertStripeInfoSolid } from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import {selectDialogStatus, selectHarUbehandledeDialoger} from "../../dialog/dialog-selector";
import {selectInaktiveringsDato, selectInnstillingerStatus} from "../innstillinger-selector";

export const AVSLUTT_FORM_NAME = 'avslutt-oppfolging-form';
const HiddenIfNormaltekst = hiddenIfHOC(Normaltekst);

function AvsluttOppfolgingperiode({
    onSubmit,
    datoErInnenfor28dager,
    avhengigheter,
    harUbehandledeDialoger,
}) {
    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={avhengigheter}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <HiddenIfNormaltekst
                                hidden={!datoErInnenfor28dager}
                            >
                                <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.beskrivelse.innenfor-28-dager" />
                            </HiddenIfNormaltekst>
                            <HiddenIfNormaltekst hidden={datoErInnenfor28dager}>
                                <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.beskrivelse" />
                            </HiddenIfNormaltekst>
                        </div>
                        <HiddenIfAlertStripeInfoSolid
                            hidden={!harUbehandledeDialoger}
                            className="blokk-xxs"
                        >
                            <FormattedMessage id="innstillinger.modal.avslutt.ubehandlede-dialoger.alert-melding" />
                        </HiddenIfAlertStripeInfoSolid>
                        <BegrunnelseForm
                            labelId="innstillinger.modal.avslutt.oppfolging.begrunnelse"
                            formNavn={AVSLUTT_FORM_NAME}
                            onSubmit={onSubmit}
                        />
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp formNavn={AVSLUTT_FORM_NAME} mini>
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avslutt" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={AVSLUTT_FORM_NAME}
                            mini
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avbryt" />
                        </RemoteResetKnapp>
                    </ModalFooter>
                </div>
            </Innholdslaster>
        </InnstillingerModal>
    );
}

AvsluttOppfolgingperiode.propTypes = {
    onSubmit: PT.func.isRequired,
    datoErInnenfor28dager: PT.bool.isRequired,
    harUbehandledeDialoger: PT.bool.isRequired,
    avhengigheter: PT.arrayOf(AppPt.status).isRequired,
};

const mapDispatchToProps = dispatch => ({
    onSubmit: form => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        return history.push('/innstillinger/avslutt/bekreft');
    },
});

const mapStateToProps = state => {
    const innstillingerStatus = selectInnstillingerStatus(state);
    const dialogStatus = selectDialogStatus(state);
    const inaktiveringsDato = selectInaktiveringsDato(state);

    const for28dagerSiden = moment().subtract(28, 'day').toISOString();
    const datoErInnenfor28dager = inaktiveringsDato > for28dagerSiden;

    return {
        datoErInnenfor28dager,
        harUbehandledeDialoger: selectHarUbehandledeDialoger(state),
        avhengigheter: [innstillingerStatus, dialogStatus]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AvsluttOppfolgingperiode
);
