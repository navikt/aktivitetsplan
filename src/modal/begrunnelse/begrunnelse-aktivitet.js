import React from 'react';
import PT from 'prop-types';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import Hovedknapp from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalHeader from '../modal-header';
import ModalContainer from '../modal-container';
import ModalFooter from '../modal-footer';
import Textarea from '../skjema/textarea/textarea';

const MAKS_LENGDE = 255;

function BegrunnelseAktivitet(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
            <div className="aktivitetvisning__underseksjon">
                <ModalContainer>
                    <Innholdstittel>
                        { props.headerTekst }
                    </Innholdstittel>
                    <Textarea
                        feltNavn="begrunnelse"
                        labelId={props.beskrivelseTekst}
                        name="begrunnelse-aktivitet"
                        maxLength={MAKS_LENGDE}
                        disabled={props.lagrer}
                    />
                </ModalContainer>
            </div>
            <ModalFooter>
                <Hovedknapp
                    spinner={props.lagrer}
                    mini
                    autoDisableVedSpinner
                >
                    <FormattedMessage id="begrunnelse-aktivitet.modal.lagre" />
                </Hovedknapp>
            </ModalFooter>
        </form>
    );
}

BegrunnelseAktivitet.propTypes = {
    headerTekst: PT.element.isRequired,
    beskrivelseTekst: PT.element.isRequired,
    lagrer: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired
};

const forLang = rules.maxLength(MAKS_LENGDE,
    <FormattedMessage id="opprett-begrunnelse.melding.feilmelding.for-lang" values={{ antall_tegn: MAKS_LENGDE }} />
);

const pakrevd = rules.minLength(0, <FormattedMessage id="opprett-begrunnelse.melding.feilmelding.for-kort" />);

const BegrunnelseAktivitetReduxForm = validForm({
    form: 'begrunnelse-aktivitet-form',
    validate: {
        begrunnelse: [forLang, pakrevd]
    }
})(BegrunnelseAktivitet);

const mapDispatchToProps = () => ({});

export default connect(null, mapDispatchToProps)(BegrunnelseAktivitetReduxForm);
