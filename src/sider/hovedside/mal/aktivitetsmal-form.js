import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { validForm, rules } from 'react-redux-form-validation';
import Textarea from '../../../modal/skjema/textarea/textarea';
import { STATUS } from '../../../ducks/utils';
import { oppdaterMal } from '../../../ducks/mal';

const MALTEKST_MAKSLENGDE = 500;

function trim(str) {
    return str ? str.trim() : '';
}

function AktivitetsmalForm({ oppdaterer, handleComplete, handleSubmit }) {
    function avbryt(e) {
        e.preventDefault();
        handleComplete();
    }

    return (
        <form onSubmit={handleSubmit}>
            <Textarea
                feltNavn="mal"
                labelId="aktivitetsmal.tekst.label"
                maxLength={MALTEKST_MAKSLENGDE}
            />
            <Hovedknapp
                className="aktivitetmal__redigering--knapp"
                spinner={oppdaterer}
                disabled={oppdaterer}
            >
                <FormattedMessage id="aktivitetsmal.lagre" />
            </Hovedknapp>
            <Knapp onClick={avbryt} disabled={oppdaterer}>
                {/* TODO: Vi må få inn type="button"*/}
                <FormattedMessage id="aktivitetsmal.avbryt" />
            </Knapp>
        </form>
    );
}

const forLangMaltekst = rules.maxLength(
    MALTEKST_MAKSLENGDE,
    <FormattedMessage
        id="aktivitetsmal.tekst.makslengde.feilmelding"
        values={{ antall_tegn: MALTEKST_MAKSLENGDE }}
    />
);

AktivitetsmalForm.propTypes = {
    oppdaterer: PT.bool.isRequired,
    handleSubmit: PT.func.isRequired,
    handleComplete: PT.func.isRequired,
};

const AktivitetsmalReduxForm = validForm({
    form: 'aktivitetsmal-form',
    validate: {
        mal: [forLangMaltekst],
    },
})(AktivitetsmalForm);

const mapStateToProps = (state, props) => {
    const malReducer = state.data.mal;
    return {
        initialValues: { mal: props.mal.mal },
        oppdaterer: malReducer.status === STATUS.RELOADING,
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (newMal, dispatch, props) => {
        const handleComplete = props.handleComplete;
        const newMalTrimmed = trim(newMal.mal);
        const oldMalTimmed = trim(props.mal.mal);
        if (newMalTrimmed !== oldMalTimmed) {
            dispatch(oppdaterMal({ mal: newMalTrimmed })).then(handleComplete);
        } else {
            handleComplete();
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetsmalReduxForm
);
