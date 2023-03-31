import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react';
import React from 'react';

import { EksternAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../../Provider';

interface Props {
    aktivitet: EksternAktivitet;
}

const EksternAktivitetHandlingerKnapper = ({ aktivitet }: Props) => {
    const { handlinger } = aktivitet.eksternAktivitet;

    const erVeileder = useErVeileder();

    if (!handlinger) {
        return null;
    }

    return (
        <div className="space-y-4 flex flex-col self-end justify-self-end w-full mb-8">
            {handlinger.flatMap((handling, index) => {
                if (handling.lenkeType === 'EKSTERN' && erVeileder) return null;
                if (handling.lenkeType === 'INTERN' && !erVeileder) return null;

                return (
                    <LinkPanel key={index} href={handling.url} target="_blank">
                        <Heading size="small">{handling.tekst}</Heading>
                        <BodyShort>{handling.subtekst}</BodyShort>
                    </LinkPanel>
                );
            })}
        </div>
    );
};

export default EksternAktivitetHandlingerKnapper;
