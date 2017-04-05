import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import Hovedknapp from 'nav-frontend-knapper/src/hovedknapp';
import { nyDialog } from '../ducks/dialog';
import Textarea from '../modal/skjema/textarea/textarea';
import Input from '../modal/skjema/input/input';

const OVERSKRIFT_MAKS_LENGDE = 255;
const TEKST_MAKS_LENGDE = 2000;

function StillingAktivitetForm({ handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <Input
                feltNavn="overskrift"
                labelId="dialog.overskrift-label"
            />
            <Textarea
                feltNavn="tekst"
                labelId="dialog.tekst-label"
                maxLength={TEKST_MAKS_LENGDE}
            />
            <Hovedknapp type="submit" ><FormattedMessage id="dialog.lag-ny-dialog" /></Hovedknapp>
        </form>
    );
}

StillingAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired
};

const pakrevdOverskrift = rules.minLength(0, 'Du må fylle ut overskriften');
const pakrevdTekst = rules.minLength(0, 'Du må fylle ut teksten');

const begrensetTittelLengde = rules.maxLength(OVERSKRIFT_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${OVERSKRIFT_MAKS_LENGDE} tegn`);
const begrensetTekstLengde = rules.maxLength(TEKST_MAKS_LENGDE, `Teksten kan ikke være lenger en ${TEKST_MAKS_LENGDE} tegn`);

const formNavn = 'ny-dialog';
const StillingAktivitetReduxForm = validForm({
    form: formNavn,
    validate: {
        overskrift: [pakrevdOverskrift, begrensetTittelLengde],
        tekst: [pakrevdTekst, begrensetTekstLengde]
    }
})(StillingAktivitetForm);

const mapStateToProps = () => {};

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (dialogData) => {
        nyDialog(dialogData)(dispatch);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StillingAktivitetReduxForm);
