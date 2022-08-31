import React from 'react';

import styles from './FeilmeldingDetaljer.module.css';
import { FeilmeldingType } from './FeilmeldingTypes';

interface PropTypes {
    feil: FeilmeldingType;
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
            <div>{detaljer?.detaljertType} </div>
            <div>{detaljer?.feilMelding}</div>
            <pre>{detaljer?.stackTrace}</pre>
            <div>{tekst}</div>
        </div>
    );
}
