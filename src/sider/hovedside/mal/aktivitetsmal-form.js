import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { reduxForm } from 'redux-form';
import Textarea from '../../../modal/skjema/textarea/textarea';


function AktivitetsmalForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <Textarea feltNavn="mal" labelId="Hva er ditt mål" maxLength={500} />
            <Hovedknapp className="aktivitetmal__redigering--knapp"><FormattedMessage id="Lagre" /></Hovedknapp>
            <Knapp type="button" onClick={props.handleCancel}>Avbryt</Knapp>
        </form>
    );
}

AktivitetsmalForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    handleCancel: PT.func.isRequired
};

const AktivitetsmalReduxForm = reduxForm({
    form: 'aktivitetsmal-form'
})(AktivitetsmalForm);

const mapStateToProps = (state, props) => ({
    initialValues: { mal: props.mal.mal }
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsmalReduxForm);
