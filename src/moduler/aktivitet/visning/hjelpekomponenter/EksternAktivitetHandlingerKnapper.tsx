import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { EksternAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { selectErVeileder } from '../../../identitet/identitet-selector';

interface Props {
    aktivitet: EksternAktivitet;
}

const EksternAktivitetHandlingerKnapper = ({ aktivitet }: Props) => {
    const { handlinger } = aktivitet.eksternAktivitet;

    const erVeileder = useSelector(selectErVeileder);

    if (!handlinger) {
        return null;
    }

    return (
        <>
            {handlinger.flatMap((handling) => {
                if (handling.lenkeType === 'EKSTERN' && erVeileder) return null;
                if (handling.lenkeType === 'INTERN' && !erVeileder) return null;

                return (
                    <Button variant="secondary" as="a" href={handling.url} target="_blank">
                        {handling.tekst}
                    </Button>
                );
            })}
        </>
    );
};

export default EksternAktivitetHandlingerKnapper;
