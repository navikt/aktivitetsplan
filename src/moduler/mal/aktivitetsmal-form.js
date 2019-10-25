import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { oppdaterMal } from './aktivitetsmal-reducer';
import Textarea from '../../felles-komponenter/skjema/input/textarea';
import { hentMalListe } from './malliste-reducer';

function validateMal(val) {
    if (val.length === 0) {
        return 'Du må fylle ut målet ditt';
    }
    if (val.length > 500) return 'Du må korte ned teksten til 500 tegn';

    return null;
}

const validator = useFormstate({
    mal: validateMal
});

function AktivitetsmalForm(props) {
    const { onSubmit, mal } = props;

    const state = validator({
        mal: mal || ''
    });

    return (
        <form className="aktivitetmal__innhold" onSubmit={state.onSubmit(onSubmit)}>
            <Textarea label="" maxLength={500} {...state.fields.mal} />
            <Hovedknapp>Lagre</Hovedknapp>
        </form>
    );
}

AktivitetsmalForm.propTypes = {
    onSubmit: PT.func.isRequired,
    mal: PT.string,
    handleComplete: PT.func.isRequired
};

AktivitetsmalForm.defaultProps = {
    mal: undefined
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: data => {
        const { handleComplete } = props;
        if (data.mal !== props.mal) {
            dispatch(oppdaterMal({ mal: data.mal }))
                .then(() => dispatch(hentMalListe()))
                .then(handleComplete());
        } else {
            handleComplete();
        }
        return Promise.resolve();
    }
});

export default connect(
    null,
    mapDispatchToProps
)(AktivitetsmalForm);
