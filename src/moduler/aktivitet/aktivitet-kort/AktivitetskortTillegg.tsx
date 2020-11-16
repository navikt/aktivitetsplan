import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { Aktivitet, Henvendelse } from '../../../types';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import AvtaltMarkering from '../avtalt-markering/avtalt-markering';
import SokeStatusEtikett from '../etikett/SokeStatusEtikett';
import DialogIkon from '../visning/underelement-for-aktivitet/dialog/DialogIkon';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: Aktivitet;
}

function AktivitetskortTillegg({ aktivitet }: Props) {
    const { avtalt, id, etikett } = aktivitet;
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, id), shallowEqual);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const ulesteHenvendelser = henvendelser.filter((h: Henvendelse) => !h.lest).length;

    if (!(avtalt || !!etikett || !!dialog)) {
        return null;
    }

    return (
        <div className={styles.tillegg}>
            <div>
                <AvtaltMarkering visible={avtalt} />
                <SokeStatusEtikett hidden={!etikett} etikett={etikett} className={styles.etikett} />
            </div>

            <HiddenIfDiv hidden={!dialog && henvendelser.length <= 0} className={styles.ikon}>
                <DialogIkon
                    antallUleste={ulesteHenvendelser}
                    classNameMedUleste={styles.dialogIkonMedUleste}
                    classNameUtenUleste={styles.dialogIkonUtenUleste}
                />
            </HiddenIfDiv>
        </div>
    );
}

export default AktivitetskortTillegg;
