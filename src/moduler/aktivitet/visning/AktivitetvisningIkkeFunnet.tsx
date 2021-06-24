import { AlertStripeFeil } from 'nav-frontend-alertstriper';

import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import styles from './AktivitetvisningIkkeFunnet.module.less';

export const AktivitetvisningIkkeFunnet = () => {
    return (
        <ModalContainer>
            <ModalHeader className={styles.header} />
            <AlertStripeFeil className={styles.feilmelding}>
                Noe er galt. Denne aktiviteten finnes ikke i aktivitetsplanen din.
            </AlertStripeFeil>
        </ModalContainer>
    );
};
