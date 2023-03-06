import { Button, Heading } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import PT from 'prop-types';
import React from 'react';

import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalFooter from '../../../felles-komponenter/modal/ModalFooter';
import FormErrorSummary from '../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Textarea from '../../../felles-komponenter/skjema/input/Textarea';

const begrunnelseValidator = (val: any) => {
    if (val.trim().length === 0) {
        return 'Du må fylle ut en begrunnelse';
    }
    if (val.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }

    return undefined;
};

interface Props {
    headerTekst: string;
    beskrivelseLabel: string;
    lagrer: boolean;
    onSubmit: (data: any) => Promise<void>;
}

function BegrunnelseForm(props: Props) {
    const { beskrivelseLabel, headerTekst, lagrer, onSubmit } = props;

    const validator = useFormstate({
        begrunnelse: begrunnelseValidator,
    });

    const state = validator({ begrunnelse: '' });

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <div className="aktivitetvisning__underseksjon">
                <ModalContainer>
                    {/*<FormErrorSummary errors={state.errors} submittoken={state.submittoken} />*/}
                    <Heading level="1" size="large">
                        {headerTekst}
                    </Heading>
                    <Textarea
                        label={beskrivelseLabel}
                        maxLength={255}
                        disabled={lagrer}
                        {...state.fields.begrunnelse}
                    />
                </ModalContainer>
            </div>
            <ModalFooter>
                <Button loading={lagrer}>Lagre</Button>
            </ModalFooter>
        </form>
    );
}

export default BegrunnelseForm;
