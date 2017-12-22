import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import { selectInnstillingerBegrunnelse } from './innstillinger-selector';
import {
    maksLengde,
    pakrevd,
} from '../../felles-komponenter/skjema/validering';

const MAKS_LENGDE = 500;

function forLangBegrunnelse(verdi, props) {
    return maksLengde(
        'avslutt.oppfolging.feilmelding.for-lang',
        (props && props.maksBeskrivelseLengde) || MAKS_LENGDE
    ).apply(this, arguments); // eslint-disable-line prefer-rest-params
}

const pakrevdBegrunnelse = pakrevd('avslutt.oppfolging.feilmelding.for-kort');

function BegrunnelseForm({ handleSubmit, labelId, maksBeskrivelseLengde }) {
    return (
        <form onSubmit={handleSubmit}>
            <br />
            <Textarea
                feltNavn="begrunnelse"
                labelId={labelId}
                maxLength={maksBeskrivelseLengde || MAKS_LENGDE}
            />
        </form>
    );
}

BegrunnelseForm.defaultProps = {
    maksBeskrivelseLengde: undefined,
};

BegrunnelseForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    labelId: PT.string.isRequired,
    maksBeskrivelseLengde: PT.number,
};

const BegrunnelseReduxForm = validForm({
    validate: {
        begrunnelse: [forLangBegrunnelse, pakrevdBegrunnelse],
    },
})(BegrunnelseForm);

const mapStateToProps = (state, props) => ({
    form: props.formNavn,
    initialValues: {
        begrunnelse:
            props.defaultBegrunnelse || selectInnstillingerBegrunnelse(state),
    },
});

BegrunnelseReduxForm.defaultProps = {
    defaultBegrunnelse: null,
};

BegrunnelseReduxForm.propTypes = {
    formNavn: PT.string.isRequired,
    defaultBegrunnelse: PT.string,
};

export default connect(mapStateToProps)(BegrunnelseReduxForm);
