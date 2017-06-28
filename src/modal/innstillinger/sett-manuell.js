import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import history from '../../history';
import Textarea from '../skjema/textarea/textarea';
import ModalFooter from '../modal-footer';

const MAKS_LENGDE = 500;

function SettManuell() {
    return (
        <div>
            <section>
                <Systemtittel>
                    <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                </Systemtittel>
                <div className="blokk-xxs">
                    <AlertStripeInfoSolid>
                        <FormattedMessage id="innstillinger.modal.manuell.infotekst" />
                    </AlertStripeInfoSolid>
                </div>
                <form onSubmit={() => history.push('/innstillinger/manuell/kvittering')} >
                    <Textarea
                        feltNavn="manuell"
                        labelId="innstillinger.modal.manuell.form.begrunnelse"
                        maxLength={MAKS_LENGDE}
                    />
                </form>
            </section>
            <ModalFooter>
                <Hovedknapp
                    mini
                    onClick={() => history.push('/innstillinger/manuell/kvittering')}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.bekreft.knapp" />
                </Hovedknapp>
                <Knapp mini onClick={() => history.push('/')} >
                    <FormattedMessage id="innstillinger.modal.manuell.avbryt.knapp" />
                </Knapp>
            </ModalFooter>
        </div>
    );
}

export default connect()(SettManuell);
