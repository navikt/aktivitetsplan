import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { Component } from 'react';

import { diffFromNowInSeconds, formatMMSS } from '../../utils';
import ModalContainer from '../modal/ModalContainer';
import ModalFooter from '../modal/ModalFooter';
import TimeoutboxLoggetUt from './TimeoutboxLoggetUt';

interface Props {
    utlopsTidspunkt: string;
}

class TimeoutboxNedtelling extends Component<Props> {
    rerender: NodeJS.Timeout | undefined;

    componentDidMount() {
        this.rerender = setInterval(() => {
            this.forceUpdate();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.rerender!!);
    }

    render() {
        const { utlopsTidspunkt } = this.props;
        const sekunderIgjen = diffFromNowInSeconds(utlopsTidspunkt);

        if (sekunderIgjen <= 0) {
            return <TimeoutboxLoggetUt />;
        }

        const tid = formatMMSS(sekunderIgjen);
        return (
            <div>
                <ModalContainer>
                    <div className="varselmodal">
                        <Innholdstittel className="blokk-s" tag="h1">
                            Obs!
                        </Innholdstittel>
                        <Normaltekst className="blokk-xxs">
                            {`Din sesjon vil utløpe om ${tid} minutter. Dersom du ikke laster siden på nytt, vil du bli logget ut. Ta vare på alt ulagret arbeid. For å laste siden på nytt, vennligst trykk "Last siden på nytt".`}
                        </Normaltekst>
                    </div>
                </ModalContainer>
                <ModalFooter>
                    <Hovedknapp className="modal-footer__knapp" onClick={() => window.location.reload()}>
                        Last siden på nytt
                    </Hovedknapp>
                    <Knapp
                        className="modal-footer__knapp"
                        onClick={() => (document.querySelector('#logout') as HTMLButtonElement)?.click()}
                    >
                        Logg ut
                    </Knapp>
                </ModalFooter>
            </div>
        );
    }
}

export default TimeoutboxNedtelling;
