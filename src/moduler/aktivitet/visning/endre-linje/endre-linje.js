import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { UnmountClosed } from 'react-collapse';
import Knappelenke from '../../../../felles-komponenter/utils/knappelenke';
import styles from './endre-linje.module.less';

function EndreLinje(props) {
    const { tittel, form, visning, endring, setEndring, kanEndre } = props;

    return (
        <div>
            <div className={styles.endreContainer}>
                <div className={styles.endreVisning}>
                    <Normaltekst className={styles.endreTittel}>{tittel}</Normaltekst>
                    <div>{endring ? null : visning}</div>
                </div>
                <Knappelenke visible={kanEndre} className={styles.endreKnapp} onClick={() => setEndring(!endring)}>
                    <div className={styles.endreKnappInnhold}>{endring ? 'Avbryt' : 'Endre'}</div>
                    <div className={endring ? styles.endreIndikasjonLukket : styles.endreIndikasjonApen} />
                </Knappelenke>
            </div>
            <UnmountClosed isOpened={endring}>
                <div className={styles.endreForm}>{form}</div>
            </UnmountClosed>
        </div>
    );
}

EndreLinje.propTypes = {
    tittel: PT.string.isRequired,
    form: PT.node.isRequired,
    visning: PT.node.isRequired,
    endring: PT.bool.isRequired,
    setEndring: PT.func.isRequired,
    kanEndre: PT.bool
};

EndreLinje.defaultProps = {
    kanEndre: true
};

export default EndreLinje;
