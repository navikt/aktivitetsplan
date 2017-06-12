import React from 'react';
import { FormattedMessage } from 'react-intl';
import { validForm, rules } from 'react-redux-form-validation';
import { Systemtittel } from 'nav-frontend-typografi';
import ModalFooter from '../modal-footer';
import history from '../../history';
import { RemoteSubmitKnapp, RemoteResetKnapp } from './remote-knapp';
import BegrunnelseForm from './begrunnelse-form';

const MAKS_LENGDE = 500;
export const AVSLUTT_FORM_NAME = 'avslutt-oppfolging-form';

const forLang = rules.maxLength(
    MAKS_LENGDE,
    <FormattedMessage
        id="avslutt.oppfolging.feilmelding.for-lang"
        values={{ MAKS_LENGDE }}
    />
);

const pakrevd = rules.minLength(
    0,
    <FormattedMessage id="avslutt.oppfolging.feilmelding.for-kort" />
);

const AvslutningForm = () => (
    <BegrunnelseForm
        labelId="innstillinger.modal.avslutt.oppfolging.begrunnelse"
        name="begrunnelse-avslutt-periode"
        maxLength={MAKS_LENGDE}
    />
);

const AvslutningReduxForm = validForm({
    form: AVSLUTT_FORM_NAME,
    destroyOnUnmount: false,
    validate: {
        begrunnelse: [forLang, pakrevd],
    },
})(AvslutningForm);

function AvsluttOppfolgingperiode() {
    return (
        <div>
            <section className="innstillinger__avslutt-periode">
                <Systemtittel>
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                </Systemtittel>
                <div className="blokk-xxs">
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.beskrivelse" />
                </div>
                <AvslutningReduxForm
                    onSubmit={() =>
                        history.push('/innstillinger/avslutt/bekreft')}
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
    );
}

export default AvsluttOppfolgingperiode;
