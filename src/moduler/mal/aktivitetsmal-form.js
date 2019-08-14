import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { withRouter } from 'react-router-dom';
import useFormstate from '@nutgaard/use-formstate';
import { STATUS } from '../../ducks/utils';
import { oppdaterMal, selectMalStatus } from './aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import Textarea from '../../felles-komponenter/skjema/input-v2/textarea';

const validator = useFormstate({
    mal: val =>
        val.length > 500 ? 'Du må korte ned teksten til 500 tegn' : null,
});

function AktivitetsmalForm(props) {
    const { oppdaterer, onSubmit, history, underOppfolging, mal } = props;

    const initial = mal ? mal.mal || '' : '';
    const state = validator({
        mal: initial,
    });

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <Textarea
                label="Når du og NAV er enige om målet ditt, kan vi samarbeide om aktuelle aktiviteter."
                maxLength={500}
                {...state.fields.mal}
            />
            <Hovedknapp
                className="aktivitetmal__redigering--knapp"
                spinner={oppdaterer}
                disabled={oppdaterer || !underOppfolging}
            >
                Lagre
            </Hovedknapp>
            <Knapp
                onClick={() => history.push('/')}
                disabled={oppdaterer}
                htmlType="button"
            >
                Avbryt
            </Knapp>
        </form>
    );
}

AktivitetsmalForm.propTypes = {
    oppdaterer: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    onSubmit: PT.func.isRequired,
    mal: PT.object,
    handleComplete: PT.func.isRequired,
    history: AppPT.history.isRequired,
};

AktivitetsmalForm.defaultProps = {
    mal: undefined,
};

const mapStateToProps = state => ({
    oppdaterer: selectMalStatus(state) === STATUS.RELOADING,
    underOppfolging: selectErUnderOppfolging(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: data => {
        const { handleComplete } = props;
        if (data.mal !== props.mal) {
            dispatch(oppdaterMal({ mal: data.mal })).then(handleComplete);
        } else {
            handleComplete();
        }
        return Promise.resolve();
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetsmalForm)
);
