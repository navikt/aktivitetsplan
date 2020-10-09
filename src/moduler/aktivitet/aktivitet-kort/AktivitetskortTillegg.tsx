import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import AvtaltMarkering from '../avtalt-markering/avtalt-markering';
import SokeStatusEtikett from '../etikett/sokeStatusEtikett';
import DialogIkon from '../visning/underelement-for-aktivitet/dialog/DialogIkon';
import { Aktivitet, Henvendelse } from '../../../types';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: Aktivitet;
}

function AktivitetskortTillegg({ aktivitet }: Props) {
    const { avtalt, id, etikett } = aktivitet;
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, id), shallowEqual);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const ulesteHenvendelser = henvendelser.filter((h: Henvendelse) => !h.lest).length;

    return (
        <HiddenIfDiv hidden={!(avtalt || !!etikett || !!dialog)} className={styles.tillegg}>
            <div>
                <AvtaltMarkering visible={avtalt} />
                <SokeStatusEtikett hidden={!etikett} etikett={etikett} className={styles.etikett} />
            </div>

            <HiddenIfDiv hidden={!dialog && henvendelser.length <= 0} className={styles.ikon}>
                <DialogIkon antallUleste={ulesteHenvendelser} />
            </HiddenIfDiv>
        </HiddenIfDiv>
    );
}

export default AktivitetskortTillegg;
