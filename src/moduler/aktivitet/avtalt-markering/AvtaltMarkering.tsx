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
        <Tag data-color="info" variant="strong" size="small">Avtalt med Nav
                    </Tag>
    );
};

export default AvtaltMarkering;
