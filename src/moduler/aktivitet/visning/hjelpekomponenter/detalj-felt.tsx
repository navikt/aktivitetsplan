import { Label } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

interface Props {
    children: React.ReactNode;
    tittel: React.ReactNode;
    fullbredde?: boolean;
    beskrivelse?: boolean;
}

const DetaljFelt = (props: Props) => {
    const { tittel, children, fullbredde, beskrivelse } = props;

    return (
        <div
            className={classNames('w-1/2 overflow-hidden overflow-ellipsis', {
                'w-full': fullbredde,
                'flex-auto break-words': beskrivelse,
            })}
        >
            <Label>{tittel}</Label>
            {children}
        </div>
    );
};

export default DetaljFelt;
