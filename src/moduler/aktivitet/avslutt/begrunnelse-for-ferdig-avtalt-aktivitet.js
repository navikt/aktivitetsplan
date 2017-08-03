import React from 'react';
import PT from 'prop-types';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import Hovedknapp from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import Textarea from '../../../felles-komponenter/skjema/textarea/textarea';
import {
    maksLengde,
    pakrevd,
    validerReferatPublisert,
} from '../../../felles-komponenter/skjema/validering';

const MAKS_LENGDE = 255;

function BegrunnelseForFerdigAvtaltAktivitet({
    handleSubmit,
    headerTekst,
    beskrivelseTekst,
    errorSummary,
    lagrer,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
            <div className="aktivitetvisning__underseksjon">
                <ModalContainer>
                    <Innholdstittel>
                        {headerTekst}
                    </Innholdstittel>
                    {errorSummary}
                    <Textarea
                        feltNavn="begrunnelse"
                        labelId={beskrivelseTekst}
                        name="begrunnelse-aktivitet"
                        maxLength={MAKS_LENGDE}
                        disabled={lagrer}
                    />
                </ModalContainer>
            </div>
            <ModalFooter>
                <Hovedknapp spinner={lagrer} mini autoDisableVedSpinner>
                    <FormattedMessage id="begrunnelse-aktivitet.modal.lagre" />
                </Hovedknapp>
            </ModalFooter>
        </form>
    );
}

BegrunnelseForFerdigAvtaltAktivitet.propTypes = {
    headerTekst: PT.element.isRequired,
    beskrivelseTekst: PT.element.isRequired,
    lagrer: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
};

const ikkeForLangBegrunnelse = maksLengde(
    'opprett-begrunnelse.melding.feilmelding.for-lang',
    MAKS_LENGDE
);
const harBegrunnelse = pakrevd(
    'opprett-begrunnelse.melding.feilmelding.for-kort'
);

const BegrunnelseAktivitetReduxForm = validForm({
    form: 'begrunnelse-aktivitet-form',
    errorSummaryTitle: (
        <FormattedMessage id="begrunnelse-aktivitet.feiloppsummering-tittel" />
    ),
    validate: {
        begrunnelse: [ikkeForLangBegrunnelse, harBegrunnelse],
        erReferatPublisert: validerReferatPublisert(),
    },
})(BegrunnelseForFerdigAvtaltAktivitet);

export default connect()(BegrunnelseAktivitetReduxForm);
