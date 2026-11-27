import { useErVeileder } from '../../Provider';
import { useNavigate } from 'react-router';
import { useRoutes } from '../../routing/useRoutes';
import { loggMittMalKlikk } from '../../felles-komponenter/utils/logging';
import { logKlikkKnapp } from '../../analytics/analytics';
import { shallowEqual, useSelector } from 'react-redux';
import { BodyShort, Button } from '@navikt/ds-react';
import { PencilIcon } from '@navikt/aksel-icons';
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
            <div className="flex w-full min-w-0 flex-row items-start justify-between gap-2">
                <BodyShort className="min-w-0 flex-1">Skriv litt om hva som er målet ditt.</BodyShort>
                <Button
                    onClick={() => endreMal('Sett et mål')}
                    variant="tertiary"
                    size="small"
                    icon={<PencilIcon aria-hidden />}
                    className="hidden sm:flex"
                >
                    <span className="hidden sm:inline">Sett et mål</span>
                </Button>
            </div>
        );
    }

    const knappTekst = viserInnevaerendePeriode ? 'Rediger' : 'Se tidligere mål';

    return (
        <div className="flex w-full min-w-0 flex-row items-start gap-2">
            <div className="min-w-0 flex-1">
                <MalText disabled={disabled} mal={mal} />
            </div>
            <Button
                onClick={() => endreMal(knappTekst)}
                variant="tertiary"
                size="small"
                icon={<PencilIcon aria-hidden />}
                className="hidden shrink-0 sm:flex"
            >
                <span className="hidden sm:inline">{knappTekst}</span>
            </Button>
        </div>
    );
}

interface MalRedigerKnappProps {
    mal?: string;
    disabled: boolean;
    className?: string;
}

export function MalRedigerKnapp({ mal, disabled, className }: MalRedigerKnappProps) {
    const erVeileder = useErVeileder();
    const navigate = useNavigate();
    const { malRoute } = useRoutes();
    const viserInnevaerendePeriode = useSelector(selectViserAktivPeriode, shallowEqual);

    const endreMal = (tekst: string) => {
        navigate(malRoute());
        loggMittMalKlikk(erVeileder);
        logKlikkKnapp(tekst);
    };

    if (!mal && !disabled) {
        return (
            <Button
                onClick={() => endreMal('Sett et mål')}
                variant="tertiary"
                size="small"
                icon={<PencilIcon aria-hidden />}
                className={className}
            >
                <span className="hidden sm:inline">Sett et mål</span>
            </Button>
        );
    }

    const knappTekst = viserInnevaerendePeriode ? 'Rediger' : 'Se tidligere mål';

    return (
        <Button
            onClick={() => endreMal(knappTekst)}
            variant="tertiary"
            size="small"
            icon={<PencilIcon aria-hidden />}
            className={`shrink-0 ${className ?? ''}`}
        >
            <span className="hidden sm:inline">{knappTekst}</span>
        </Button>
    );
}

export default MalContent;
