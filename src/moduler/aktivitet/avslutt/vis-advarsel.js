import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Innholdstittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalFooter from '../../../felles-komponenter/modal/ModalFooter';
import aktivitetvisningStyles from '../../aktivitet/visning/Aktivitetsvisning.module.css';

function VisAdvarsel({ onSubmit, headerTekst }) {
    return (
        <div>
            <ModalContainer className={aktivitetvisningStyles.underseksjon}>
                <Innholdstittel>{headerTekst}</Innholdstittel>
                <AlertStripe type="advarsel">
                    Når du lagrer, blir aktiviteten låst og du kan ikke lenger endre innholdet.
                </AlertStripe>
            </ModalContainer>
            <ModalFooter>
                <Hovedknapp htmlType="button" onClick={onSubmit}>
                    Lagre
                </Hovedknapp>
            </ModalFooter>
        </div>
    );
}

VisAdvarsel.propTypes = {
    headerTekst: PT.string.isRequired,
    onSubmit: PT.func.isRequired,
};

export default VisAdvarsel;
