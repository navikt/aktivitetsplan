import React, { Component } from 'react';
import PT from 'prop-types';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import ModalContainer from '../modal/modal-container';
import ModalFooter from '../modal/modal-footer';
import { moment } from '../../utils';
import TimeoutboxLoggetUt from './timeoutbox-logget-ut';

class TimeoutboxNedtelling extends Component {
    componentWillMount() {
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
        return (
            <div>
                <ModalContainer>
                    <div className="varselmodal">
                        <Innholdstittel className="blokk-s" tag="h1">
                            <FormattedMessage id="timeoutbox.tittel" />
                        </Innholdstittel>
                        <Normaltekst className="blokk-xxs">
                            <FormattedMessage
                                id="timeoutbox.innhold.nedtelling"
                                values={{
                                    tid: durationLeft.format('mm:ss', {
                                        trim: false
                                    })
                                }}
                            />
                        </Normaltekst>
                    </div>
                </ModalContainer>
                <ModalFooter>
                    <Hovedknapp className="modal-footer__knapp" onClick={() => window.location.reload()}>
                        <FormattedMessage id="timeoutbox.knapp.last_pa_nytt" />
                    </Hovedknapp>
                    <Knapp className="modal-footer__knapp" onClick={() => document.querySelector('#logout').click()}>
                        <FormattedMessage id="timeoutbox.knapp.loggut" />
                    </Knapp>
                </ModalFooter>
            </div>
        );
    }
}

TimeoutboxNedtelling.propTypes = {
    utlopsTidspunkt: PT.string.isRequired
};

export default TimeoutboxNedtelling;
