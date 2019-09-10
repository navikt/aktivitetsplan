import React from 'react';
import PT from 'prop-types';
import { EtikettLiten } from 'nav-frontend-typografi';
import { UnmountClosed } from 'react-collapse';
import Knappelenke from '../../../../felles-komponenter/utils/knappelenke';
import styles from './endre-linje.module.less';

function EndreLinje(props) {
    const { tittel, form, visning, endring, setEndring } = props;

    return (
        <div>
            <div className={styles.endreLinje}>
                <EtikettLiten className={styles.endreLinjeTittel}>
                    {tittel}
                </EtikettLiten>
                <div className={styles.endreLinjeVisning}>
                    {endring ? null : visning}
                </div>
                <Knappelenke
                    className={styles.endreLinjeKnapp}
                    onClick={() => setEndring(!endring)}
                >
                    {endring ? 'Avbryt' : 'Endre'}
                </Knappelenke>
            </div>
            <UnmountClosed isOpened={endring}>
                <div className={styles.endreInnhold}>
                    {form}
                </div>
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
};

export default EndreLinje;
