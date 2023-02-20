import { Alert, Button } from '@navikt/ds-react';
import { Innholdstittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalFooter from '../../../felles-komponenter/modal/ModalFooter';
import aktivitetvisningStyles from '../../aktivitet/visning/Aktivitetsvisning.module.less';

function VisAdvarsel({ onSubmit, headerTekst }) {
    return (
        <div>
            <ModalContainer className={aktivitetvisningStyles.underseksjon}>
                <Innholdstittel>{headerTekst}</Innholdstittel>
                <Alert variant="warning">
                    Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.
                </Alert>
            </ModalContainer>
            <ModalFooter>
                <Button onClick={onSubmit}>Lagre</Button>
            </ModalFooter>
        </div>
    );
}

VisAdvarsel.propTypes = {
    headerTekst: PT.string.isRequired,
    onSubmit: PT.func.isRequired,
};

export default VisAdvarsel;
