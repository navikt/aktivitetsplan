import { BodyLong, BodyShort, Button, Heading, Modal } from '@navikt/ds-react';
import { differenceInSeconds, parseISO } from 'date-fns';
import PT from 'prop-types';
import React, { Component } from 'react';

import { sekunderTilMinutter } from '../../utils/dateUtils';

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
        const sekunderIgjen = differenceInSeconds(parseISO(utlopsTidspunkt), new Date());

        if (sekunderIgjen <= 0) {
            return (
                <Modal.Content>
                    <Heading level="1" size="large" spacing>
                        Obs!
                    </Heading>
                    <BodyShort spacing>Sesjonen har utløpt. Du må logge inn igjen for å fortsette.</BodyShort>
                    <Button variant="primary" className="mt-2" onClick={() => window.location.reload()}>
                        Last siden på nytt
                    </Button>
                </Modal.Content>
            );
        }

        const tid = sekunderTilMinutter(sekunderIgjen);

        return (
            <Modal.Content>
                <Heading className="blokk-s" level="1" size="large" spacing>
                    Obs!
                </Heading>
                <BodyLong className="blokk-xxs" spacing>
                    {`Din sesjon vil utløpe om ${tid} minutter. Dersom du ikke laster siden på nytt, vil du bli logget ut. Ta vare på alt ulagret arbeid. For å laste siden på nytt, vennligst trykk "Last siden på nytt".`}
                </BodyLong>
                <Button className="mr-4" onClick={() => window.location.reload()}>
                    Last siden på nytt
                </Button>
                <Button variant="secondary" onClick={() => document.querySelector('#logout').click()}>
                    Logg ut
                </Button>
            </Modal.Content>
        );
    }
}

TimeoutboxNedtelling.propTypes = {
    utlopsTidspunkt: PT.string.isRequired,
};

export default TimeoutboxNedtelling;
