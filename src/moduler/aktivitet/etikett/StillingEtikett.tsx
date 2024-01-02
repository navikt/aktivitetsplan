import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';

import { StillingStatus } from '../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../datatypes/internAktivitetTypes';

interface Etikett {
    text: string;
    variant: TagProps['variant'];
}

const getEtikett: Record<StillingStatus, Etikett> = {
    SOKNAD_SENDT: { text: 'Sendt søknad', variant: 'success' },
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
        <Tag className="mr-2" variant={variant} size="small">
            {text}
        </Tag>
    );
};

export default StillingEtikett;
