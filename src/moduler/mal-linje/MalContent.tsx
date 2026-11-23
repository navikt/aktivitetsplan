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
            <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-2">
                <BodyShort className="truncate">Skriv litt om hva som er målet ditt.</BodyShort>
                <Button
                    onClick={() => endreMal('Sett et mål')}
                    variant="tertiary"
                    size="small"
                    icon={<PencilIcon aria-hidden />}
                >
                    <span className="hidden sm:inline">Sett et mål</span>
                </Button>
            </div>
        );
    }

    const knappTekst = viserInnevaerendePeriode ? 'Rediger' : 'Se tidligere mål';

    return (
        <div className="flex min-w-0 flex-1 flex-row items-center gap-2">
            <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
                <div className="truncate">
                    <MalText disabled={disabled} mal={mal} />
                </div>
            </div>
            <Button
                onClick={() => endreMal(knappTekst)}
                variant="tertiary"
                size="small"
                icon={<PencilIcon aria-hidden />}
                className="shrink-0"
            >
                <span className="hidden sm:inline">{knappTekst}</span>
            </Button>
        </div>
    );
}

export default MalContent;
