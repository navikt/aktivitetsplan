import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';

import { StillingsStatus } from '../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../datatypes/internAktivitetTypes';

interface Etikett {
    text: string;
    variant: TagProps['variant'];
}

const getEtikett: Record<StillingsStatus, Etikett> = {
    SOKNAD_SENDT: { text: 'Sendt søknad og venter på svar', variant: 'success' },
    INNKALT_TIL_INTERVJU: { text: 'Skal på intervju', variant: 'info' },
    JOBBTILBUD: { text: 'Fått jobbtilbud 🎉', variant: 'warning' },
    AVSLAG: { text: 'Ikke fått jobben', variant: 'neutral' },
    INGEN_VALGT: { text: 'Ikke fått jobben', variant: 'neutral' },
};

export interface Props {
    aktivitet: StillingAktivitet;
}

const StillingEtikett = (props: Props) => {
    const { aktivitet } = props;

    const stillingsstatus = aktivitet.etikett;

    if (!stillingsstatus) return null;

    const { text, variant } = getEtikett[stillingsstatus];

    return (
        <Tag variant={variant} size="small">
            {text}
        </Tag>
    );
};

export default StillingEtikett;
