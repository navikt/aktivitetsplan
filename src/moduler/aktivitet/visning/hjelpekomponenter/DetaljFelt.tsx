import { Heading } from '@navikt/ds-react';
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
            className={classNames('w-1/2 min-w-52 overflow-hidden overflow-ellipsis', {
                'w-full': fullbredde,
                'flex-auto break-words': beskrivelse,
            })}
        >
            <Heading level="2" size="xsmall">
                {tittel}
            </Heading>
            {children}
        </div>
    );
};

export default DetaljFelt;
