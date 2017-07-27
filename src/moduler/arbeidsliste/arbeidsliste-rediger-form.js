import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import history from '../../history';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';
import { redigerArbeidsliste } from './arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { hentArbeidslisteReducer } from './arbeidsliste-selector';
import { LUKK_MODAL } from '../../ducks/modal';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../felles-komponenter/modal/modal-container';

const KOMMENTAR_MAKS_LENGDE = 255;
const pakrevd = rules.minLength(
    0,
    <FormattedMessage id="arbeidsliste.feilmelding.for-kort" />
);
const begrensetKommentarLengde = rules.maxLength(
    KOMMENTAR_MAKS_LENGDE,
    <FormattedMessage
        id="arbeidsliste-form.feilmelding.kommentar-lengde"
        values={{ KOMMENTAR_MAKS_LENGDE }}
    />
);

function RedigerArbeidslisteForm({ handleSubmit, lukkModal }) {
    return (
        <form onSubmit={handleSubmit}>
            <section>
                <ModalContainer className="arbeidsliste__form-container">
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
                    <button
                        type="submit"
                        className="knapp knapp--hoved"
                        onClick={() => {
                            handleSubmit();
                            history.push('/');
                            lukkModal();
                        }}
                    >
                        <FormattedMessage id="arbeidsliste.knapp.lagre" />
                    </button>
                    <button
                        type="button"
                        className="knapp"
                        onClick={() => {
                            history.push('/');
                            lukkModal();
                        }}
                    >
                        <FormattedMessage id="arbeidsliste.knapp.avbryt" />
                    </button>
                </ModalFooter>
            </section>
        </form>
    );
}

RedigerArbeidslisteForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
    initialValues: PT.any.isRequired,
};

const RedigerArbeidslisteFormValidation = validForm({
    form: 'arbeidsliste-rediger',
    validate: {
        kommentar: [begrensetKommentarLengde, pakrevd],
        frist: [],
    },
})(RedigerArbeidslisteForm);

const mapStateToProps = state => {
    const arbeidsliste = hentArbeidslisteReducer(state);
    return {
        veileder: state.data.identitet.data.id,
        initialValues: {
            kommentar: arbeidsliste.data.kommentar,
            frist: arbeidsliste.data.frist,
        },
    };
};

const mapDispatchToProps = dispatch => {
    const fnr = getFodselsnummer();
    const lagArbeidsliste = (form, ownProps) => ({
        fnr,
        veilederId: ownProps.veileder,
        kommentar: form.kommentar,
        frist: form.frist,
    });
    return {
        onSubmit: formData =>
            dispatch(redigerArbeidsliste(fnr, lagArbeidsliste(formData))),
        lukkModal: () => dispatch({ type: LUKK_MODAL }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    RedigerArbeidslisteFormValidation
);
