import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Datovelger from '../../felles-komponenter/skjema/datovelger/datovelger';

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

function ArbeidslisteForm({ handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <div>
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
        </form>
    );
}

ArbeidslisteForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    // arbeidsliste: AppPT.arbeidsliste.isRequired,
};

const ArbeidslisteFormValidation = validForm({
    form: 'arbeidsliste-rediger',
    validate: {
        kommentar: [begrensetKommentarLengde, pakrevd],
        frist: [],
    },
})(ArbeidslisteForm);

const mapStateToProps = (state, props) => ({
    initialValues: {
        kommentar: props.arbeidsliste.kommentar,
    },
});

const mapDispatchToProps = () => ({
    // onSubmit: formData => {
    //     const arbeidsliste = { kommentar: formData.kommentar };
    //     dispatch(
    //         redigerEllerLagreArbeidsliste(getFodselsnummer(), arbeidsliste)
    //     ).then(() => history.push('/'));
    // },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    ArbeidslisteFormValidation
);
