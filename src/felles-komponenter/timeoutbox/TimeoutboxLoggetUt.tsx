import { BodyShort, Button, Heading } from '@navikt/ds-react';
import React from 'react';

import ModalContainer from '../modal/ModalContainer';
import ModalFooter from '../modal/ModalFooter';

const TimeoutboxLoggetUt = () => (
    <div>
        <ModalContainer>
            <div className="varselmodal">
                <Heading level="1" size="large">
                    Obs!
                </Heading>
                <BodyShort>Sesjonen har utløpt. Du må logge inn igjen for å fortsette.</BodyShort>
            </div>
        </ModalContainer>
        <ModalFooter>
            <Button variant="primary" className="modal-footer__knapp" onClick={() => window.location.reload()}>
                Last siden på nytt
            </Button>
        </ModalFooter>
    </div>
);

export default TimeoutboxLoggetUt;
