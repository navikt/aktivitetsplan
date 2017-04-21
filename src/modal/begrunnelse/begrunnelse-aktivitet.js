import React, { PropTypes as PT, Component } from 'react';
import ModalHeader from '../modal-header';
import ModalContainer from '../modal-container';
import ModalFooter from '../modal-footer';
import Innholdstittel from "nav-frontend-typografi/src/innholdstittel";
import Textarea from "nav-frontend-skjema/src/textarea";
import Hovedknapp from "nav-frontend-knapper/src/hovedknapp";

class BegrunnelseAktivitet extends Component {

    componentDidUnmount() {

    }

    onLagre() {
        const onSuccess = () => history.goBack();
        const onError = () => {};
        this.props.onLagre(this.refs.beskrivelse.tekstomrade.value)
            .then(onSuccess, onError);
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
                            label={ this.props.beskrivelseTekst }
                            name="begrunnelse-aktivitet"
                            maxLength={250}
                            disabled={this.props.lagrer}
                            ref="beskrivelse"
                        />
                    </ModalContainer>
                </div>
                <ModalFooter>
                    <Hovedknapp
                        spinner={this.props.lagrer}
                        mini
                        autoDisableVedSpinner={true}
                        onClick={() => this.onLagre()}
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
