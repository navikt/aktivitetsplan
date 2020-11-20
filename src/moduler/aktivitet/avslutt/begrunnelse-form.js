import useFormstate from '@nutgaard/use-formstate';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Innholdstittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import FormErrorSummary from '../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Textarea from '../../../felles-komponenter/skjema/input/textarea';

const begrunnelseValidator = (val) => {
    if (val.trim().length === 0) {
        return 'Du må fylle ut en begrunnelse';
    }
    if (val.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }

    return null;
};

function BegrunnelseForm(props) {
    const { beskrivelseLabel, headerTekst, lagrer, onSubmit } = props;

    const validator = useFormstate({
        begrunnelse: begrunnelseValidator,
    });

    const state = validator({ begrunnelse: '' });

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <div className="aktivitetvisning__underseksjon">
                <ModalContainer>
                    <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
                    <Innholdstittel>{headerTekst}</Innholdstittel>
                    <Textarea
                        label={beskrivelseLabel}
                        maxLength={255}
                        visTellerFra={255}
                        disabled={lagrer}
                        {...state.fields.begrunnelse}
                    />
                </ModalContainer>
            </div>
            <ModalFooter>
                <Hovedknapp spinner={lagrer} autoDisableVedSpinner>
                    Lagre
                </Hovedknapp>
            </ModalFooter>
        </form>
    );
}

BegrunnelseForm.propTypes = {
    headerTekst: PT.string.isRequired,
    beskrivelseLabel: PT.string.isRequired,
    lagrer: PT.bool.isRequired,
    onSubmit: PT.func.isRequired,
};

export default BegrunnelseForm;
