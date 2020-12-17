import useFormstate from '@nutgaard/use-formstate';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Textarea as NavTextArea, SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';

import { useMoveSelectionStartToEnd } from '../../felles-komponenter/hooks/useMoveSelectionStartToEnd';
import { useReduxDispatch } from '../../felles-komponenter/hooks/useReduxDispatch';
import Textarea from '../../felles-komponenter/skjema/input/Textarea';
import { oppdaterMal } from './aktivitetsmal-reducer';
import { hentMalListe } from './malliste-reducer';

function validateMal(val: string) {
    if (val.length === 0) {
        return 'Feltet må fylles ut';
    }
    if (val.length > 500) return 'Du må korte ned teksten til 500 tegn';

    return undefined;
}

interface Props {
    mal?: string;
    handleComplete: () => void;
}

function MalForm(props: Props) {
    const dispatch = useReduxDispatch();
    const { mal, handleComplete } = props;

    const validator = useFormstate({
        mal: validateMal,
    });

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
                    aria-label="Ditt mål"
                    maxLength={500}
                    {...state.fields.mal}
                />
            </SkjemaGruppe>
            <Hovedknapp>Lagre</Hovedknapp>
        </form>
    );
}

export default MalForm;
