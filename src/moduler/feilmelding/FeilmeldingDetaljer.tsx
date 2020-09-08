import React from 'react';
import { FeilmeldingType } from './FeilmeldingTypes';
import styles from './FeilmeldingDetaljer.module.less';

interface PropTypes {
    feil: FeilmeldingType;
}

function DivIfPresent(props: { children?: React.ReactNode }) {
    if (props.children === undefined || props.children === null) {
        return null;
    }
    return <div>{props.children}</div>;
}

export default function FeilmeldingDetalj(props: PropTypes) {
    const { melding, type, httpStatus, tekst } = props.feil;
    const id: string = (melding && melding.id) || type;
    const detaljer = melding && melding.detaljer;

    return (
        <div className={styles.feilmeldingdetaljer}>
            <h2>{type}</h2>
            <div>{id}</div>
            <div>{httpStatus}</div>
            <DivIfPresent>{detaljer?.detaljertType}</DivIfPresent>
            <DivIfPresent>{detaljer?.detaljertType}</DivIfPresent>
            <DivIfPresent>{detaljer?.feilMelding}</DivIfPresent>
            {detaljer ? <pre>{detaljer.stackTrace}</pre> : null}
            <DivIfPresent> {tekst} </DivIfPresent>
        </div>
    );
}
