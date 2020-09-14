import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { oppdaterMal } from './aktivitetsmal-reducer';
import Textarea from '../../felles-komponenter/skjema/input/textarea';
import { hentMalListe } from './malliste-reducer';
import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { useMoveSelectionStartToEnd } from '../../felles-komponenter/hooks/useMoveSelectionStartToEnd';

function validateMal(val: string) {
    if (val.length === 0) {
        return 'Feltet må fylles ut';
    }
    if (val.length > 500) return 'Du må korte ned teksten til 500 tegn';

    return undefined;
}

const validator = useFormstate({
    mal: validateMal,
});

interface Props {
    mal?: string;
    handleComplete: () => void;
}

function MalForm(props: Props) {
    const dispatch = useReduxDispatch();
    const { mal, handleComplete } = props;

    const textAreaCls = 'aktivitetplansmal';
    useMoveSelectionStartToEnd(textAreaCls);

    const onSubmit = (data: { mal: string }) => {
        if (data.mal !== props.mal) {
            dispatch(oppdaterMal({ mal: data.mal }))
                .then(() => dispatch(hentMalListe()))
                .then(handleComplete());
        } else {
            handleComplete();
        }
        const elem = document.querySelector('.aktivitet-modal') as HTMLDivElement;
        elem && elem.focus();
        return Promise.resolve();
    };

    const state = validator({
        mal: mal || '',
    });

    return (
        <form className="aktivitetmal__innhold" onSubmit={state.onSubmit(onSubmit)}>
            <SkjemaGruppe>
                <Textarea
                    textareaClass={textAreaCls}
                    visTellerFra={150}
                    autoFocus
                    label=""
                    maxLength={500}
                    {...state.fields.mal}
                />
            </SkjemaGruppe>
            <Hovedknapp>Lagre</Hovedknapp>
        </form>
    );
}

export default MalForm;
