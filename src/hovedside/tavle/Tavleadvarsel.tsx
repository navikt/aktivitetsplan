import { Normaltekst } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import React from 'react';

import {
    GRUPPE_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../constant';
import { Aktivitet } from '../../types';
import { ReactComponent as ObsSVG } from './obs.svg';
import styles from './Tavleadvarsel.module.less';

function getAdvarseltekst(aktivitet: Aktivitet, erVeileder: boolean) {
    if (aktivitet.status === STATUS_FULLFOERT) {
        return 'Aktiviteten er fullført og kan ikke endres.';
    } else if (aktivitet.status === STATUS_AVBRUTT) {
        return 'Aktiviteten er avbrutt og kan ikke endres.';
    } else if (aktivitet.type === MOTE_TYPE) {
        return 'Du kan ikke endre status på møtet. Ta kontakt med veilederen din for å endre møtet.';
    } else if (aktivitet.type === SAMTALEREFERAT_TYPE) {
        return 'Du kan ikke endre status på samtalereferatet. Ta kontakt med veilederen din for å endre dette.';
    } else if ([UTDANNING_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE].includes(aktivitet.type)) {
        if (erVeileder) {
            return 'For å endre aktiviteten må du gå til Arena.';
        }
        return 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.';
    }

    return 'Du kan ikke endre status på denne aktiviteten. Ta kontakt med veilederen din for å gjøre endringer.';
}

interface Props {
    hidden: boolean;
    draggingAktivitet: Aktivitet | undefined;
    erVeileder: boolean;
}

function Tavleadvarsel(props: Props) {
    const { hidden, draggingAktivitet, erVeileder } = props;

    if (hidden || !draggingAktivitet) {
        return null;
    }

    return (
        <div className={styles.advarsel}>
            <Veilederpanel svg={<ObsSVG />} type="plakat" kompakt>
                <Normaltekst>{getAdvarseltekst(draggingAktivitet, erVeileder)}</Normaltekst>
            </Veilederpanel>
        </div>
    );
}

export default Tavleadvarsel;
