import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { rules, validForm } from 'react-redux-form-validation';
import Textarea from '../../modal/skjema/textarea/textarea';

const MAKS_LENGDE = 500;

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

function BegrunnelseForm({ handleSubmit, labelId }) {
    return (
        <form onSubmit={handleSubmit}>
            <Textarea
                feltNavn="begrunnelse"
                labelId={labelId}
                maxLength={MAKS_LENGDE}
            />
        </form>
    );
}

BegrunnelseForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    labelId: PT.string.isRequired,
};

const BegrunnelseReduxForm = validForm({
    validate: {
        begrunnelse: [forLang, pakrevd],
    },
})(BegrunnelseForm);

const mapStateToProps = (state, props) => ({
    form: props.formNavn,
    initialValues: {
        begrunnelse: state.data.innstillinger.begrunnelse,
    },
});

BegrunnelseReduxForm.propTypes = {
    formNavn: PT.string.isRequired,
};

export default connect(mapStateToProps)(BegrunnelseReduxForm);
