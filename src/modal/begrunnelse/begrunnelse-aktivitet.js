import React, { PropTypes as PT, Component } from 'react';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import { Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import ModalHeader from '../modal-header';
import ModalContainer from '../modal-container';
import ModalFooter from '../modal-footer';
import history from '../../history';
import { autobind } from '../../utils';

const MAKS_LENGDE = 255;

class BegrunnelseAktivitet extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }
    onLagre() {
        this.props.onLagre(this.beskrivelse.tekstomrade.value)
            .then(history.goBack);
    }
    onChange() {
        this.forceUpdate();
    }
    getFeilmelding() {
        const beskrivelse = this.beskrivelse;
        if (beskrivelse && beskrivelse.tekstomrade.value.length > MAKS_LENGDE) {
            return { feilmelding: `Du må korte ned teksten til ${MAKS_LENGDE} tegn` }; // TODO dra ut tekst
        }
        return null;
    }
    render() {
        const feilmelding = this.getFeilmelding();
        return (
            <div>
                <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
                <div className="aktivitetvisning">
                    <ModalContainer>
                        <Innholdstittel>
                            { this.props.headerTekst }
                        </Innholdstittel>
                        <Textarea
                            feil={feilmelding}
                            label={this.props.beskrivelseTekst}
                            name="begrunnelse-aktivitet"
                            maxLength={MAKS_LENGDE}
                            disabled={this.props.lagrer}
                            ref={(ref) => { this.beskrivelse = ref; }}
                            onChange={this.onChange}
                        />
                    </ModalContainer>
                </div>
                <ModalFooter>
                    <Hovedknapp
                        spinner={this.props.lagrer}
                        mini
                        autoDisableVedSpinner
                        onClick={this.onLagre}
                        disabled={!!feilmelding}
                    >
                        Lagre
                    </Hovedknapp>
                </ModalFooter>
            </div>
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
