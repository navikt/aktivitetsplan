import { Alert, Button, Heading } from '@navikt/ds-react';
import React from 'react';

import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalFooter from '../../../felles-komponenter/modal/ModalFooter';
import aktivitetvisningStyles from '../../aktivitet/visning/Aktivitetsvisning.module.less';

interface Props {
    headerTekst: string;
    onSubmit: (value: any) => any;
}

const VisAdvarsel = ({ onSubmit, headerTekst }: Props) => {
    return (
        <div>
            <ModalContainer className={aktivitetvisningStyles.underseksjon}>
                <Heading level="1" size="large">
                    {headerTekst}
                </Heading>
                <Alert variant="warning">
                    Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.
                </Alert>
            </ModalContainer>
            <ModalFooter>
                <Button onClick={onSubmit}>Lagre</Button>
            </ModalFooter>
        </div>
    );
};

export default VisAdvarsel;
