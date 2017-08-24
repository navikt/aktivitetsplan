import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import history from '../../history';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';
import { redigerArbeidsliste } from './arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { selectArbeidslisteReducer } from './arbeidsliste-selector';
import { LUKK_MODAL } from '../../ducks/modal';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import {
    lagArbeidsliste,
    KOMMENTAR_MAKS_LENGDE,
    pakrevd,
    begrensetKommentarLengde,
} from './arbeidsliste-utils';

function RedigerArbeidslisteForm({ handleSubmit, lukkModal, errorSummary }) {
    return (
        <form onSubmit={handleSubmit}>
            <section>
                <ModalContainer className="arbeidsliste__form-container">
                    {errorSummary}
                    <Textarea
                        labelId="arbeidsliste.kommentar"
                        feltNavn={'kommentar'}
                        maxLength={KOMMENTAR_MAKS_LENGDE}
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

RedigerArbeidslisteForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
    initialValues: PT.any.isRequired,
    errorSummary: PT.node.isRequired,
};

const RedigerArbeidslisteFormValidation = validForm({
    form: 'arbeidsliste-rediger',
    errorSummaryTitle: (
        <FormattedMessage id="arbeidsliste.form.feiloppsummering.tittel" />
    ),
    validate: {
        kommentar: [begrensetKommentarLengde, pakrevd],
    },
})(RedigerArbeidslisteForm);

const mapStateToProps = state => {
    const arbeidsliste = selectArbeidslisteReducer(state);
    return {
        veileder: state.data.identitet.data.id,
        initialValues: {
            kommentar: arbeidsliste.data.kommentar,
            frist: arbeidsliste.data.frist,
        },
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const fnr = getFodselsnummer();
    return {
        onSubmit: formData => {
            dispatch(
                redigerArbeidsliste(fnr, lagArbeidsliste(fnr, formData, props))
            ).then(() => {
                dispatch({ type: LUKK_MODAL });
                history.push('/');
            });
        },
        lukkModal: () => dispatch({ type: LUKK_MODAL }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    RedigerArbeidslisteFormValidation
);
