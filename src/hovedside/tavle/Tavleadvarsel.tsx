import React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { ReactComponent as ObsSVG } from './obs.svg';
import styles from './Tavleadvarsel.module.less';

interface Props {
    hidden: boolean;
}

function Tavleadvarsel(props: Props) {
    const { hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <div className={styles.advarsel}>
            <Veilederpanel svg={<ObsSVG />} type="plakat" kompakt>
                <div className="timeoutbox-nedtelling">
                    <Systemtittel className="timeoutbox-modal__tittel">Aktivitet kan ikke bli flyttet</Systemtittel>
                    <Normaltekst className="timeoutbox-modal__beskrivelse">
                        Ta kontakt med NAV hvis det er noe som er til hinder for at du kan begynne på eller fullføre
                        denne aktiviteten. Du kan ikke oppdatere status for denne aktiviteten selv.
                    </Normaltekst>
                </div>
            </Veilederpanel>
        </div>
    );
}

export default Tavleadvarsel;
