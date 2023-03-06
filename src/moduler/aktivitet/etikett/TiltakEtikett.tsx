import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';

import { ArenaAktivitet, ArenaEtikett } from '../../../datatypes/arenaAktivitetTypes';
import { tiltakEtikettMapper } from '../../../utils/textMappers';

const getVariant = (etikettnavn: ArenaEtikett): TagProps['variant'] => {
    switch (etikettnavn) {
        case ArenaEtikett.JATAKK:
        case ArenaEtikett.AKTUELL:
        case ArenaEtikett.TILBUD:
        case ArenaEtikett.VENTELISTE:
        case ArenaEtikett.INFOMOETE:
            return 'info';
        case ArenaEtikett.AVSLAG:
        case ArenaEtikett.IKKAKTUELL:
            return 'neutral';
        case ArenaEtikett.IKKEM:
        case ArenaEtikett.NEITAKK:
            return 'warning';
    }
};

const getText = (etikettnavn: ArenaEtikett): string => {
    return tiltakEtikettMapper[etikettnavn];
};

export interface Props {
    aktivitet: ArenaAktivitet;
}

const TiltakEtikett = (props: Props) => {
    const { aktivitet } = props;

    const etikett = aktivitet.etikett;

    if (!etikett) return null;

    const variant = getVariant(etikett);
    const text = getText(etikett);

    return (
        <Tag className="mr-2" variant={variant} size="small">
            {text}
        </Tag>
    );
};

export default TiltakEtikett;
