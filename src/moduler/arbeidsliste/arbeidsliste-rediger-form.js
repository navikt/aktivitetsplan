import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';
import history from '../../history';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';
import { redigerArbeidsliste } from './arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import {
    selectArbeidslisteReducer,
    selectSistEndretAv,
    selectEndretDato,
} from './arbeidsliste-selector';
import { LUKK_MODAL } from '../../felles-komponenter/modal/modal-reducer';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import {
    lagArbeidsliste,
    KOMMENTAR_MAKS_LENGDE,
    pakrevd,
    begrensetKommentarLengde,
} from './arbeidsliste-utils';
import { formaterDato } from '../../utils';
import { selectIdentitetId } from '../identitet/identitet-selector';

function RedigerArbeidslisteForm({
    handleSubmit,
    lukkModal,
    errorSummary,
    sistEndretAv,
    endretDato,
}) {
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

                    <Undertekst className="arbeidsliste__sist-endret-info">
                        <FormattedMessage
                            id="arbeidsliste.endringsinfo.footer"
                            values={{
                                dato: formaterDato(endretDato),
                                veileder: sistEndretAv,
                            }}
                        />
                    </Undertekst>

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
    sistEndretAv: PT.string.isRequired,
    endretDato: PT.string.isRequired,
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
        sistEndretAv: selectSistEndretAv(state),
        endretDato: selectEndretDato(state),
        veileder: selectIdentitetId(state),
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
