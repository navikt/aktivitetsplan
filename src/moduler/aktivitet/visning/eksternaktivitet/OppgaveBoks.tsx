import { Alert } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Oppgave, OppgaveLenke } from '../../../../datatypes/eksternAktivitetTypes';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import CustomBodyLong from '../hjelpekomponenter/CustomBodyLong';
import styles from './OppgaveBoks.module.less';

interface Props {
    oppgave?: OppgaveLenke;
}

// TODO bytt dette ut med 'Alert m/ heading' når vi er over på det nye designsystemet
const customAlertStripe = (oppgave: Oppgave) => (
    <Alert variant="warning" className="w-full mb-3">
        <h3 className={styles.tekst}>{oppgave.tekst}</h3>
        {oppgave.subtekst && <CustomBodyLong className={styles.subtekst}>{oppgave.subtekst}</CustomBodyLong>}
        <a href={oppgave.url} target="_blank" rel="noopener noreferrer" className="knapp knapp--hoved">
            {oppgave.knapptekst}
        </a>
    </Alert>
);

const OppgaveBoks = ({ oppgave }: Props) => {
    const erVeileder = useSelector(selectErVeileder);

    if (!oppgave) return null;

    if (erVeileder && oppgave.intern) {
        return customAlertStripe(oppgave.intern);
    }

    if (!erVeileder && oppgave.ekstern) {
        return customAlertStripe(oppgave.ekstern);
    }

    return null;
};

export default OppgaveBoks;
