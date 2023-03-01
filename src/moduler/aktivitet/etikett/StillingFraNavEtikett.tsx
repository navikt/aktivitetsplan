import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';

import { StillingFraNavSoknadsstatus } from '../../../datatypes/aktivitetTypes';

interface Etikett {
    text: string;
    variant: TagProps['variant'];
}

const getEtikett: Record<StillingFraNavSoknadsstatus, Etikett> = {
    VENTER: { text: 'Venter på å bli kontaktet', variant: 'success' },
    CV_DELT: { text: 'CV er delt med arbeidsgiver', variant: 'info' },
    SKAL_PAA_INTERVJU: { text: 'Skal på intervju', variant: 'info' },
    JOBBTILBUD: { text: 'Fått jobbtilbud 🎉', variant: 'neutral' },
    AVSLAG: { text: 'Ikke fått jobben', variant: 'neutral' },
    IKKE_FATT_JOBBEN: { text: 'Ikke fått jobben', variant: 'neutral' },
};

export interface Props {
    soknadsstatus?: StillingFraNavSoknadsstatus;
}

const StillingFraNavEtikett = (props: Props) => {
    const { soknadsstatus } = props;

    if (!soknadsstatus) return null;

    const { text, variant } = getEtikett[soknadsstatus];

    return (
        <Tag variant={variant} size="small">
            {text}
        </Tag>
    );
};

export default StillingFraNavEtikett;
