import React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { ReactComponent as ObsSVG } from './obs.svg';
import { Aktivitet } from '../../types';
import { GRUPPE_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE } from '../../constant';
import styles from './Tavleadvarsel.module.less';

function getAdvarseltekst(aktivitet: Aktivitet) {
    if (aktivitet.status === 'FULLFORT') {
        return 'Aktiviteten er fullført og kan ikke endres.';
    } else if (aktivitet.status === 'AVBRUTT') {
        return 'Aktiviteten er avbrutt og kan ikke endres.';
    } else if (aktivitet.type === 'MOTE') {
        return 'Du kan ikke endre status på møtet. Ta kontakt med veilederen din for å endre møtet.';
    } else if ([UTDANNING_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE].includes(aktivitet.type)) {
        return 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.';
    }

    return 'Du kan ikke endre status på møtet. Ta kontakt med veilederen din for å endre møtet.';
}

interface Props {
    hidden: boolean;
    draggingAktivitet: Aktivitet | undefined;
}

function Tavleadvarsel(props: Props) {
    const { hidden, draggingAktivitet } = props;

    if (hidden || !draggingAktivitet) {
        return null;
    }

    return (
        <div className={styles.advarsel}>
            <Veilederpanel svg={<ObsSVG />} type="plakat" kompakt>
                <Normaltekst>{getAdvarseltekst(draggingAktivitet)}</Normaltekst>
            </Veilederpanel>
        </div>
    );
}

export default Tavleadvarsel;
