import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';
import { redigerArbeidsliste } from './arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import {
    selectSistEndretAv,
    selectEndretDato,
    selectArbeidslisteData,
} from './arbeidsliste-selector';
import { LUKK_MODAL } from '../../felles-komponenter/modal/modal-reducer';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import {
    lagArbeidsliste,
    KOMMENTAR_MAKS_LENGDE,
    pakrevd,
    begrensetKommentarLengde,
    begrensetOverskriftLengde,
    pakrevdOverskrift,
    OVERSKRIFT_MAKS_LENGDE,
} from './arbeidsliste-utils';
import { formaterDato } from '../../utils';
import { selectIdentitetId } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import Input from '../../felles-komponenter/skjema/input/input';

function RedigerArbeidslisteForm({
    handleSubmit,
    lukkModal,
    errorSummary,
    sistEndretAv,
    endretDato,
    history,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <section>
                <ModalContainer className="arbeidsliste__form-container">
                    {errorSummary}
                    <Input
                        labelId="arbeidsliste.overskrift"
                        feltNavn={'overskrift'}
                        maxLength={OVERSKRIFT_MAKS_LENGDE}
                        disabled={false}
                    />
                    <Textarea
                        labelId="arbeidsliste.kommentar"
                        feltNavn={'kommentar'}
                        maxLength={KOMMENTAR_MAKS_LENGDE}
                        visTellerFra={500}
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
    history: AppPT.history.isRequired,
};

const RedigerArbeidslisteFormValidation = validForm({
    form: 'arbeidsliste-rediger',
    errorSummaryTitle: (
        <FormattedMessage id="arbeidsliste.form.feiloppsummering.tittel" />
    ),
    validate: {
        kommentar: [begrensetKommentarLengde, pakrevd],
        overskrift: [begrensetOverskriftLengde, pakrevdOverskrift],
    },
})(RedigerArbeidslisteForm);

const mapStateToProps = state => {
    const arbeidsliste = selectArbeidslisteData(state);
    return {
        sistEndretAv: selectSistEndretAv(state),
        endretDato: selectEndretDato(state),
        veileder: selectIdentitetId(state),
        initialValues: {
            kommentar: arbeidsliste.kommentar,
            overskrift: arbeidsliste.overskrift,
            frist: arbeidsliste.frist,
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
                props.history.push('/');
            });
        },
        lukkModal: () => dispatch({ type: LUKK_MODAL }),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        RedigerArbeidslisteFormValidation
    )
);
