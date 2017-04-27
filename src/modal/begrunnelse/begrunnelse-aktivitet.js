import React, { PropTypes as PT, Component } from 'react';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import { Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import ModalHeader from '../modal-header';
import ModalContainer from '../modal-container';
import ModalFooter from '../modal-footer';
import history from '../../history';

const MAKS_LENGDE = 255;

class BegrunnelseAktivitet extends Component {
    onLagre() {
        const onSuccess = () => history.goBack();
        const onError = () => {};
        this.props.onLagre(this.beskrivelse.tekstomrade.value)
            .then(onSuccess, onError);
    }
    onChange() {
        this.forceUpdate();
    }
    getFeilmelding() {
        const beskrivelse = this.beskrivelse;
        if (beskrivelse !== undefined && beskrivelse.tekstomrade.value.length > 255) {
            return { feilmelding: `Du må korte ned teksten til ${MAKS_LENGDE} tegn` }; // TODO dra ut tekst
        }
        return null;
    }
    render() {
        return (
            <section>
                <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
                <div className="aktivitetvisning">
                    <ModalContainer>
                        <Innholdstittel>
                            { this.props.headerTekst }
                        </Innholdstittel>
                        <Textarea
                            feil={this.getFeilmelding()}
                            label={this.props.beskrivelseTekst}
                            name="begrunnelse-aktivitet"
                            maxLength={MAKS_LENGDE}
                            disabled={this.props.lagrer}
                            ref={(ref) => { this.beskrivelse = ref; }}
                            onChange={() => this.onChange()}
                        />
                    </ModalContainer>
                </div>
                <ModalFooter>
                    <Hovedknapp
                        spinner={this.props.lagrer}
                        mini
                        autoDisableVedSpinner
                        onClick={() => this.onLagre()}
                        disabled={!!this.getFeilmelding()}
                    >
                        Lagre
                    </Hovedknapp>
                </ModalFooter>
            </section>
        );
    }
}

BegrunnelseAktivitet.propTypes = {
    headerTekst: PT.element.isRequired,
    beskrivelseTekst: PT.element.isRequired,
    lagrer: PT.bool.isRequired,
    onLagre: PT.func.isRequired
};

export default BegrunnelseAktivitet;
