import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { validForm, rules } from 'react-redux-form-validation';
import { formValueSelector } from 'redux-form';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { RemoteSubmitKnapp, RemoteResetKnapp } from './remote-knapp';
import history from '../../history';
import ModalFooter from '../modal-footer';
import BegrunnelseForm from './begrunnelse-form';
import { settManuell } from '../../ducks/situasjon';

const MAKS_LENGDE = 500;
const SETT_MANUELL_FORM_NAME = 'sett-manuell-form';

const SettManuellForm = () => (
    <BegrunnelseForm
        labelId="innstillinger.modal.manuell.begrunnelse"
        name="begrunnelse-sett-manuell"
        maxLength={MAKS_LENGDE}
    />
);

const forLang = rules.maxLength(
    MAKS_LENGDE,
    <FormattedMessage
        id="manuell.feilmelding.for-lang"
        values={{ MAKS_LENGDE }}
    />
);

const pakrevd = rules.minLength(
    0,
    <FormattedMessage id="manuell.feilmelding.for-kort" />
);

const SettManuellReduxForm = validForm({
    form: SETT_MANUELL_FORM_NAME,
    validate: {
        begrunnelse: [forLang, pakrevd],
    },
})(SettManuellForm);

function SettManuell({ doSettManuell, begrunnelse, veilederId }) {
    return (
        <div>
            <section className="innstillinger__sett-manuell">
                <Systemtittel>
                    <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                </Systemtittel>
                <div className="blokk-xxs">
                    <AlertStripeInfoSolid>
                        <FormattedMessage id="innstillinger.modal.manuell.infotekst" />
                    </AlertStripeInfoSolid>
                </div>
                <SettManuellReduxForm
                    onSubmit={() => doSettManuell(begrunnelse, veilederId)}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp formNavn={SETT_MANUELL_FORM_NAME} mini>
                    <FormattedMessage id="innstillinger.modal.manuell.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    mini
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.avbryt.knapp" />
                </RemoteResetKnapp>
            </ModalFooter>
        </div>
    );
}

SettManuell.defaultProps = {
    begrunnelse: undefined,
    veilederId: undefined,
};

SettManuell.propTypes = {
    begrunnelse: PT.string,
    veilederId: PT.string,
    doSettManuell: PT.func.isRequired,
};

const mapStateToProps = state => ({
    veilederId: state.data.identitet.data.id,
    begrunnelse: formValueSelector(SETT_MANUELL_FORM_NAME)(
        state,
        'begrunnelse'
    ),
    doSettManuell: PT.func.isRequired,
});

const mapDispatchToProps = dispatch => ({
    doSettManuell: (begrunnelse, veilederId) => {
        dispatch(settManuell(begrunnelse, veilederId)).then(
            history.push('/innstillinger/manuell/kvittering')
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettManuell);
