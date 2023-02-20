import { Button } from '@navikt/ds-react';
import moment from 'moment';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React, { Component } from 'react';

import ModalContainer from '../modal/ModalContainer';
import ModalFooter from '../modal/ModalFooter';
import TimeoutboxLoggetUt from './TimeoutboxLoggetUt';

class TimeoutboxNedtelling extends Component {
    componentDidMount() {
        this.rerender = setInterval(() => {
            this.forceUpdate();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.rerender);
    }

    render() {
        const { utlopsTidspunkt } = this.props;
        const sekunderIgjen = moment(utlopsTidspunkt).diff(moment(), 'seconds');
        const durationLeft = moment.duration(sekunderIgjen, 'seconds');

        if (sekunderIgjen <= 0) {
            return <TimeoutboxLoggetUt />;
        }

        const tid = durationLeft.format('mm:ss', { trim: false });
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
                    <Button className="modal-footer__knapp mr-4" onClick={() => window.location.reload()}>
                        Last siden på nytt
                    </Button>
                    <Button
                        variant="secondary"
                        className="modal-footer__knapp"
                        onClick={() => document.querySelector('#logout').click()}
                    >
                        Logg ut
                    </Button>
                </ModalFooter>
            </div>
        );
    }
}

TimeoutboxNedtelling.propTypes = {
    utlopsTidspunkt: PT.string.isRequired,
};

export default TimeoutboxNedtelling;
