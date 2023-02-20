import React, { ReactNode } from 'react';

interface Props {
    className?: string;
    feilmeldingId?: string;
    feil?: string;
    tag?: string;
    children: ReactNode;
}

const Skjema = ({ children }: Props) => {
    return <form>{children}</form>;
};

export default Skjema;
