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
import { selectKvpPeriodeForValgteOppfolging } from '../oppfolging-status/oppfolging-selector';

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

function KvpUtskriftForm({ handleSubmit, kvpPerioder }) {
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
                    <UtskriftValg
                        tittelId="Kontorsperret aktivitetsplan"
                        tekstId="Skriv kun ut kontrosperret periode. Er ment å bruke for arkivering i kommunalt akriv. Kontorsperret periode må være avsluttet før du kan skrive ut."
                    />
                    {kvpPerioder &&
                        kvpPerioder.map(kvp =>
                            <Radio
                                id={kvp.opprettetDato}
                                feltNavn="utskriftPlanType"
                                label={
                                    <Normaltekst>
                                        <FormattedMessage
                                            id={`${kvp.opprettetDato} - ${kvp.avsluttetDato}`}
                                        />
                                    </Normaltekst>
                                }
                                value={kvp.opprettetDato}
                            />
                        )}
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
    kvpPerioder: PT.arrayOf(PT.object),
};

KvpUtskriftForm.defaultProps = {
    kvpPerioder: [],
};

const KvpUtskriftFormForm = reduxForm({
    form: 'velg-print-form',
})(KvpUtskriftForm);

const mapStateToProps = state => {
    const kvpPerioder = selectKvpPeriodeForValgteOppfolging(state);
    return {
        initialValues: {
            utskriftPlanType: 'helePlanen',
        },
        kvpPerioder,
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        dispatch(velgPrintType(data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    KvpUtskriftFormForm
);
