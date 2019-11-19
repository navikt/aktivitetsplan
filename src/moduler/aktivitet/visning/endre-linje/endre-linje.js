import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { UnmountClosed } from 'react-collapse';
import styles from './endre-linje.module.less';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';

function EndreLinje(props) {
    const { tittel, form, visning, endring, setEndring, kanEndre } = props;

    return (
        <section className={styles.underseksjon}>
            <button
                onClick={() => setEndring(!endring)}
                className={styles.endreContainer}
                aria-expanded={endring}
                disabled={!kanEndre}
            >
                <div className={styles.endreVisning}>
                    <Normaltekst className={styles.endreTittel}>{tittel}</Normaltekst>
                    <div>{endring ? null : visning}</div>
                </div>
                <VisibleIfDiv visible={kanEndre} className={styles.endreKnapp}>
                    <div className={styles.endreKnappInnhold}>{endring ? 'Avbryt' : 'Endre'}</div>
                    <div className={endring ? styles.endreIndikasjonLukket : styles.endreIndikasjonApen} />
                </VisibleIfDiv>
            </button>

            <UnmountClosed isOpened={endring}>
                <div className={styles.endreForm}>{form}</div>
            </UnmountClosed>
        </section>
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
