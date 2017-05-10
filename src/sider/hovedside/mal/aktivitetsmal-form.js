import React from 'react';
import PT from 'prop-types'
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { validForm, rules } from 'react-redux-form-validation';
import Textarea from '../../../modal/skjema/textarea/textarea';

const MALTEKST_MAKSLENGDE = 500;

function AktivitetsmalForm(props) {
    function avbryt(e) {
        e.preventDefault();
        props.handleCancel();
    }

    return (
        <form onSubmit={props.handleSubmit}>
            <Textarea feltNavn="mal" labelId="aktivitetsmal.tekst.label" maxLength={MALTEKST_MAKSLENGDE} />
            <Hovedknapp className="aktivitetmal__redigering--knapp"><FormattedMessage id="aktivitetsmal.lagre" /></Hovedknapp>
            <Knapp onClick={avbryt}> {/* TODO: Vi må få inn type="button"*/}
                <FormattedMessage id="aktivitetsmal.avbryt" />
            </Knapp>
        </form>
    );
}

const forLangMaltekst = rules.maxLength(MALTEKST_MAKSLENGDE,
    <FormattedMessage id="aktivitetsmal.tekst.makslengde.feilmelding" values={{ antall_tegn: MALTEKST_MAKSLENGDE }} />
);

AktivitetsmalForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    handleCancel: PT.func.isRequired
};

const AktivitetsmalReduxForm = validForm({
    form: 'aktivitetsmal-form',
    validate: {
        mal: [forLangMaltekst]
    }
})(AktivitetsmalForm);

const mapStateToProps = (state, props) => ({
    initialValues: { mal: props.mal.mal }
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsmalReduxForm);
