import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { reduxForm } from 'redux-form';
import Radio from '../../felles-komponenter/skjema/input/radio';
import { velgPrintType } from './utskrift-duck';

function UtskriftValg({ tittelId, tekstId }) {
    return (
        <div>
            <Undertittel>
                <FormattedMessage id={tittelId} />
            </Undertittel>
            <Normaltekst>
                <FormattedMessage id={tekstId} />
            </Normaltekst>
        </div>
    );
}

UtskriftValg.propTypes = {
    tittelId: PT.string.isRequired,
    tekstId: PT.string.isRequired,
};

function KvpUtskriftForm({ handleSubmit }) {
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
                        feltNavn="utskriftPlanType"
                        label={
                            <UtskriftValg
                                tittelId="Hele aktivitetsplan"
                                tekstId="Skriver ut hele aktivitetsplan, også kontorsperret periode. Er ment å bruke hvis du skal print ut til bruker."
                            />
                        }
                        value="helePlanen"
                        id="id--helePlanen"
                    />
                    <Radio
                        feltNavn="utskriftPlanType"
                        label={
                            <UtskriftValg
                                tittelId="Aktivitetsplan"
                                tekstId="Skriver ut aktivitetsplanen uten kontorsperret periode. Er ment å bruke hvis du skal sende aktivitsplanen til trygdeetaten(stat)."
                            />
                        }
                        value="aktivitetsplan"
                        id="id--aktivitetsplan"
                    />
                    <Radio
                        feltNavn="utskriftPlanType"
                        label={
                            <UtskriftValg
                                tittelId="Kontorsperret aktivitetsplan"
                                tekstId="Skriv kun ut kontrosperret periode. Er ment å bruke for arkivering i kommunalt akriv. Kontorsperret periode må være avsluttet før du kan skrive ut."
                            />
                        }
                        value="kvpPlan"
                        id="id--kvpPlan"
                    />
                </div>
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp>
                    <FormattedMessage id="print-melding-form.lagre" />
                </Hovedknapp>
            </div>
        </form>
    );
}

KvpUtskriftForm.propTypes = {
    handleSubmit: PT.func.isRequired,
};

const KvpUtskriftFormForm = reduxForm({
    form: 'velg-print-form',
})(KvpUtskriftForm);

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        dispatch(velgPrintType(data));
    },
});

export default connect(null, mapDispatchToProps)(KvpUtskriftFormForm);
