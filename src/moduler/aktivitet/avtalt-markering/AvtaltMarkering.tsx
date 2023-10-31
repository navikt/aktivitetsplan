import { Tag } from '@navikt/ds-react';
import React from 'react';

interface Props {
    hidden: boolean;
}

const AvtaltMarkering = (props: Props) => {
    const { hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <Tag variant="alt3-filled" size="small">
            Avtalt med NAV
        </Tag>
    );
};

export default AvtaltMarkering;
