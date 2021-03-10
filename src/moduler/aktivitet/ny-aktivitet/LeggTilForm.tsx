import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import Lenkepanel from '../../../felles-komponenter/lenkepanel';
import Modal from '../../../felles-komponenter/modal/modal';
import { selectErVeileder } from '../../identitet/identitet-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import styles from './LeggTilForm.module.less';

const LeggTilForm = () => {
    const erVeileder = useSelector(selectErVeileder);
    const aktivitetFeilmeldinger = useSelector(selectAktivitetFeilmeldinger);

    return (
        <Modal
            contentLabel="ny-aktivitet-modal"
            contentClass="ny-aktivitet-visning"
            feilmeldinger={aktivitetFeilmeldinger}
        >
            <div className={styles.leggTilHeader}>
                <Normaltekst hidden={erVeileder} className={styles.hjelpeTekst}>
                    Her kan du legge til ulike aktiviteter du gjør for å nå målet ditt.
                </Normaltekst>

                <div className={styles.tittelBoks}>
                    <Innholdstittel className={styles.nyAktivitetTittel}>Legg til</Innholdstittel>

                    <EtikettBase className={styles.etikett} hidden={!erVeileder}>
                        FOR NAV-ANSATT
                    </EtikettBase>
                </div>
            </div>
            <div hidden={!erVeileder} className={styles.lenker}>
                <Lenkepanel border href="/aktivitet/ny/sokeavtale" hidden={!erVeileder}>
                    Avtale om å søke jobber
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/behandling" hidden={!erVeileder}>
                    Medisinsk behandling
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/mote" hidden={!erVeileder}>
                    Møte med NAV
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/samtalereferat" hidden={!erVeileder}>
                    Samtalereferat
                </Lenkepanel>
            </div>

            <hr hidden={!erVeileder} className={styles.deleLinje} />
            <div className={styles.lenker}>
                <div className={styles.etikettBruker}>
                    <EtikettBase className={styles.etikett} hidden={!erVeileder}>
                        FOR BRUKER OG NAV-ANSATT
                    </EtikettBase>
                </div>

                <Lenkepanel border href="/aktivitet/ny/stilling" hidden={false}>
                    En jobb jeg vil søke på
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/ijobb" hidden={false}>
                    Jobb jeg har nå
                </Lenkepanel>
                <Lenkepanel border href="/aktivitet/ny/egen" hidden={false}>
                    Jobbrettet egenaktivitet
                </Lenkepanel>
            </div>
        </Modal>
    );
};

export default LeggTilForm;
