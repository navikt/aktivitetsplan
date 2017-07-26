import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';
import { leggTilArbeidsliste } from './arbeidsliste-reducer';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import { LUKK_MODAL } from '../../ducks/modal';

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

function LeggTilArbeidslisteForm({ handleSubmit, lukkModal }) {
    return (
        <form onSubmit={handleSubmit}>
            <section>
                <div className="arbdeidsliste__form">
                    <Textarea
                        labelId={`${name}.kommentar`}
                        feltNavn={'kommentar'}
                        maxLength={KOMMENTAR_MAKS_LENGDE}
                        disabled={false}
                    />
                    <Datovelger
                        feltNavn="frist"
                        labelId="arbeidsavtale.form.frist"
                    />
                </div>
                <div className="arbeidsliste__skillelinje">
                    <button
                        type="submit"
                        className="knapp knapp--hoved"
                        onClick={handleSubmit}
                    >
                        <FormattedMessage id="modal.knapp.lagre" />
                    </button>
                    <button type="button" className="knapp" onClick={lukkModal}>
                        <FormattedMessage id="modal.knapp.avbryt" />
                    </button>
                </div>
            </section>
        </form>
    );
}

LeggTilArbeidslisteForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
};

const LeggTilArbeidslisteFormValidation = validForm({
    form: 'arbeidsliste-legg-til',
    validate: {
        kommentar: [begrensetKommentarLengde, pakrevd],
        frist: [],
    },
})(LeggTilArbeidslisteForm);

const mapStateToProps = state => ({
    veileder: state.data.identitet.data.id,
});

const mapDispatchToProps = (dispatch, props) => {
    const fnr = getFodselsnummer();
    const lagArbeidsliste = form => ({
        fnr,
        veilederId: props.veileder,
        kommentar: form.kommentar,
        frist: form.frist,
    });
    return {
        onSubmit: formData => {
            const arbeidsliste = lagArbeidsliste(formData);
            dispatch(leggTilArbeidsliste(fnr, arbeidsliste)).then(() => {
                dispatch(LUKK_MODAL);
                return history.push('/');
            });
        },
        lukkModal: () => {
            dispatch(LUKK_MODAL);
            return history.push('/');
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    LeggTilArbeidslisteFormValidation
);
