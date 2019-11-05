import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { oppdaterMal } from './aktivitetsmal-reducer';
import Textarea from '../../felles-komponenter/skjema/input/textarea';
import { hentMalListe } from './malliste-reducer';
import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';

function validateMal(val: string) {
    if (val.length === 0) {
        return 'Feltet må fylles ut';
    }
    if (val.length > 500) return 'Du må korte ned teksten til 500 tegn';

    return undefined;
}

const validator = useFormstate({
    mal: validateMal
});

interface Props {
    mal?: string;
    handleComplete: () => void;
}

function MalForm(props: Props) {
    const dispatch = useReduxDispatch();
    const { mal, handleComplete } = props;

    const onSubmit = (data: { mal: string }) => {
        if (data.mal !== props.mal) {
            dispatch(oppdaterMal({ mal: data.mal }))
                .then(() => dispatch(hentMalListe()))
                .then(handleComplete());
        } else {
            handleComplete();
        }
        return Promise.resolve();
    };

    const state = validator({
        mal: mal || ''
    });

    return (
        <form className="aktivitetmal__innhold" onSubmit={state.onSubmit(onSubmit)}>
            <Textarea label="" maxLength={500} {...state.fields.mal} />
            <Hovedknapp>Lagre</Hovedknapp>
        </form>
    );
}

export default MalForm;
