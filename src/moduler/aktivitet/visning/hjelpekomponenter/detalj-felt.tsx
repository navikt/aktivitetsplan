import classNames from 'classnames';
import { EtikettLiten } from 'nav-frontend-typografi';
import React from 'react';

interface Props {
    children: React.ReactNode;
    tittel: React.ReactNode;
    fullbredde?: boolean;
    beskrivelse?: boolean;
}

function DetaljFelt(props: Props) {
    const { tittel, children, fullbredde, beskrivelse } = props;

    return (
        <div
            className={classNames('aktivitetsdetaljer__felt', 'detaljfelt', {
                'detaljfelt--fullbredde': fullbredde,
                'detaljfelt--beskrivelse': beskrivelse,
            })}
        >
            <EtikettLiten className="detaljfelt__tittel" tag="h2">
                {tittel}
            </EtikettLiten>
            {children}
        </div>
    );
}

export default DetaljFelt;
