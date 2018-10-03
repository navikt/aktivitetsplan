import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { withRouter } from 'react-router-dom';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';
import { leggTilArbeidsliste } from './arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { LUKK_MODAL } from '../../felles-komponenter/modal/modal-reducer';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import {
    lagArbeidsliste,
    KOMMENTAR_MAKS_LENGDE,
    pakrevd,
    begrensetKommentarLengde,
    fristErEtterIDag,
    begrensetOverskriftLengde,
    pakrevdOverskrift,
    OVERSKRIFT_MAKS_LENGDE,
} from './arbeidsliste-utils';
import { selectIdentitetId } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import Input from '../../felles-komponenter/skjema/input/input';

function LeggTilArbeidslisteForm({
    handleSubmit,
    lukkModal,
    errorSummary,
    history,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <section className="arbeidsliste__form">
                <ModalContainer className="arbeidsliste__form-container">
                    {errorSummary}
                    <Input
                        labelId="arbeidsliste.overskrift"
                        feltNavn={'overskrift'}
                        maxLength={OVERSKRIFT_MAKS_LENGDE}
                        bredde="M"
                        disabled={false}
                    />
                    <Textarea
                        labelId="arbeidsliste.kommentar"
                        feltNavn={'kommentar'}
                        maxLength={KOMMENTAR_MAKS_LENGDE}
                        visTellerFra={500}
                        disabled={false}
                    />
                    <Datovelger
                        feltNavn="frist"
                        labelId="arbeidsavtale.form.frist"
                    />
                </ModalContainer>
                <ModalFooter>
                    <Hovedknapp htmlType="submit">
                        <FormattedMessage id="arbeidsliste.knapp.lagre" />
                    </Hovedknapp>
                    <Knapp
                        onClick={e => {
                            e.preventDefault();
                            history.push('/');
                            lukkModal();
                        }}
                    >
                        <FormattedMessage id="arbeidsliste.knapp.avbryt" />
                    </Knapp>
                </ModalFooter>
            </section>
        </form>
    );
}

LeggTilArbeidslisteForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    history: AppPT.history.isRequired,
};

const LeggTilArbeidslisteFormValidation = validForm({
    form: 'arbeidsliste-legg-til',
    errorSummaryTitle: (
        <FormattedMessage id="arbeidsliste.form.feiloppsummering.tittel" />
    ),
    validate: {
        kommentar: [begrensetKommentarLengde, pakrevd],
        overskrift: [begrensetOverskriftLengde, pakrevdOverskrift],
        frist: [fristErEtterIDag],
    },
})(LeggTilArbeidslisteForm);

const mapStateToProps = state => ({
    veileder: selectIdentitetId(state),
});

const mapDispatchToProps = (dispatch, props) => {
    const fnr = getFodselsnummer();
    return {
        onSubmit: formData => {
            dispatch(
                leggTilArbeidsliste(fnr, lagArbeidsliste(fnr, formData, props))
            ).then(() => {
                dispatch({ type: LUKK_MODAL });
                props.history.push('/');
            });
        },
        lukkModal: () => dispatch({ type: LUKK_MODAL }),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        LeggTilArbeidslisteFormValidation
    )
);
