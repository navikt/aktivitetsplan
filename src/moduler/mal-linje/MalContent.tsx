import { useErVeileder } from '../../Provider';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../../routing/useRoutes';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import { logKlikkKnapp } from '../../amplitude/amplitude';
import { shallowEqual, useSelector } from 'react-redux';
import { BodyShort, Button } from '@navikt/ds-react';
import React from 'react';
import MalText from './MalTekst';
import { selectViserAktivPeriode } from '../oppfolging-status/oppfolging-selector';

interface MalContentProps {
    mal?: string;
    disabled: boolean;
}

function MalContent(props: MalContentProps) {
    const { disabled, mal } = props;
    const erVeileder = useErVeileder();
    const navigate = useNavigate();
    const { malRoute } = useRoutes();
    const endreMal = (tekst: string) => {
        navigate(malRoute());
        loggMittMalKlikk(erVeileder);
        logKlikkKnapp(tekst);
    };

    const viserInnevaerendePeriode = useSelector(selectViserAktivPeriode, shallowEqual);

    if (!mal && !disabled) {
        return (
            <div>
                <BodyShort>Skriv litt om hva som er målet ditt slik at vi kan hjelpe deg bedre.</BodyShort>
                <ul className="list-disc ml-6 mb-4">
                    <li>
                        <BodyShort>Hva er målet på kort og på lang sikt?</BodyShort>
                    </li>
                    <li>
                        <BodyShort>Hva slags jobb ønsker du deg?</BodyShort>
                    </li>
                </ul>
                <Button onClick={() => endreMal('Sett et mål')} variant="secondary" size="small">
                    Sett et mål
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-4">
            <MalText disabled={disabled} mal={mal} />
            <Button onClick={() => endreMal('Endre målet')} variant="secondary" size="small">
                {viserInnevaerendePeriode ? 'Endre målet' : 'Se tidligere mål'}
            </Button>
        </div>
    );
}

export default MalContent;
