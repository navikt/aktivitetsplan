import { Tag } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
    hidden?: boolean;
}
const EtikettBase = (props: Props) => {
    const { className, children, hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <Tag variant="neutral" size="small" className={classNames(className)}>
            {children}
        </Tag>
    );
};

export default EtikettBase;
