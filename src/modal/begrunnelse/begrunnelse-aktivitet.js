import React, { PropTypes as PT, Component } from 'react';
import Innholdstittel from 'nav-frontend-typografi/src/innholdstittel';
import { Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
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
        const onSuccess = () => history.goBack();
        const onError = () => {}; // TODO legge til feilhåndtering
        this.props.onLagre(this.beskrivelse.tekstomrade.value)
            .then(onSuccess, onError);
    }
    onChange() {
        this.forceUpdate();
    }
    getFeilmelding() {
        const beskrivelse = this.beskrivelse;
        if (beskrivelse && beskrivelse.tekstomrade.value.length > MAKS_LENGDE) {
            return { feilmelding: <FormattedMessage id="opprett-begrunnelse.melding.feilmelding" values={{ MAKS_LENGDE }} /> };
        }
        return null;
    }
    render() {
        const feilmelding = this.getFeilmelding();
        return (
            <div>
                <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
                <div className="aktivitetvisning__underseksjon">
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
                        <FormattedMessage id="begrunnelse-aktivitet.modal.lagre" />
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
