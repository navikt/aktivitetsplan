import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { reduxForm } from 'redux-form';
import Radio from '../../felles-komponenter/skjema/input/radio';
import { velgPrintType } from './utskrift-duck';

function KvpUtskriftForm({ handleSubmit, lagrer }) {
    return (
        <form onSubmit={handleSubmit} className="printmelding__form">
            <div className="printmelding__skjema">
                <div className="printmelding__tittel">
                    <Innholdstittel>
                        <FormattedMessage id="Velg hva du ønsker å skrive ut" />
                    </Innholdstittel>
                </div>

                <div>
                    <Radio
                        feltNavn="helePlanen"
                        label={
                            <div>
                                <FormattedMessage id="Hele aktivitetsplanen" />
                                <Normaltekst>
                                    <FormattedMessage id="Skriver ut hele aktivitetsplan, også kontorsperret periode. Er ment å bruke hvis du skal print ut til bruker" />
                                </Normaltekst>
                            </div>
                        }
                        value="helePlanen"
                        id="id--helePlanen"
                    />
                    <Radio
                        feltNavn="aktivitetsplan"
                        label={<FormattedMessage id="aktivitetsplan" />}
                        value="aktivitetsplan"
                        id="id--aktivitetsplan"
                    />
                    <Radio
                        feltNavn="kvpPlan"
                        label={<FormattedMessage id="kvpPlan" />}
                        value="kvpPlan"
                        id="id--kvpPlan"
                    />
                </div>
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp spinner={lagrer} disabled={lagrer}>
                    <FormattedMessage id="print-melding-form.lagre" />
                </Hovedknapp>
            </div>
        </form>
    );
}

KvpUtskriftForm.propTypes = {
    handleSubmit: PT.object.isRequired,
    lagrer: PT.bool.isRequired,
};

const KvpUtskriftFormForm = reduxForm({
    form: 'velg-print-form',
})(KvpUtskriftForm);

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        dispatch(velgPrintType(data));
    },
});

export default connect(mapDispatchToProps)(KvpUtskriftFormForm);
