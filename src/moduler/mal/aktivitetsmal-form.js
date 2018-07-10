import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { validForm, rules } from 'react-redux-form-validation';
import { withRouter } from 'react-router-dom';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import { autobind } from '../../utils';
import { STATUS } from '../../ducks/utils';
import { oppdaterMal, selectMalStatus } from './aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';

const MALTEKST_MAKSLENGDE = 500;

function trim(str) {
    return str ? str.trim() : '';
}

class AktivitetsmalForm extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    render() {
        const { oppdaterer, handleSubmit, history } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Textarea
                    feltNavn="mal"
                    labelId="aktivitetsmal.tekst.label"
                    maxLength={MALTEKST_MAKSLENGDE}
                    textareaRef={textarea => {
                        this.textarea = textarea;
                    }}
                />
                <Hovedknapp
                    className="aktivitetmal__redigering--knapp"
                    spinner={oppdaterer}
                    disabled={oppdaterer}
                >
                    <FormattedMessage id="aktivitetsmal.lagre" />
                </Hovedknapp>
                <Knapp
                    onClick={() => history.push('/')}
                    disabled={oppdaterer}
                    htmlType="button"
                >
                    <FormattedMessage id="aktivitetsmal.avbryt" />
                </Knapp>
            </form>
        );
    }
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
    history: AppPT.history.isRequired,
};

const AktivitetsmalReduxForm = validForm({
    form: 'aktivitetsmal-form',
    validate: {
        mal: [forLangMaltekst],
    },
})(AktivitetsmalForm);

const mapStateToProps = (state, props) => ({
    initialValues: { mal: props.mal.mal },
    oppdaterer: selectMalStatus(state) === STATUS.RELOADING,
});

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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetsmalReduxForm)
);
