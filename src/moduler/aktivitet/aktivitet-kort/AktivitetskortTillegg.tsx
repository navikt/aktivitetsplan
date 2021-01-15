import React from 'react';
import {connect, shallowEqual, useSelector} from 'react-redux';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { Henvendelse } from '../../../datatypes/dialogTypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import AvtaltMarkering from '../avtalt-markering/avtalt-markering';
import SokeStatusEtikett from '../etikett/SokeStatusEtikett';
import DialogIkon from '../visning/underelement-for-aktivitet/dialog/DialogIkon';
import styles from './Aktivitetskort.module.less';
import IkkeDeltMarkering from "../ikke-delt-markering/ikke-delt-markering";
import {MOTE_TYPE, SAMTALEREFERAT_TYPE} from "../../../constant";
import {selectErVeileder} from "../../identitet/identitet-selector";

interface Props {
    aktivitet: Aktivitet;
    manglerReferat: boolean;
    manglerDialog: boolean
}

function AktivitetskortTillegg({aktivitet, manglerReferat, manglerDialog}: Props) {
    const { avtalt, id, etikett } = aktivitet;
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, id), shallowEqual);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const ulesteHenvendelser = henvendelser.filter((h: Henvendelse) => !h.lest).length;
    const ikkeDelt = manglerReferat || manglerDialog;

    if (!(avtalt || !!etikett || !!dialog || ikkeDelt)) {
        return null;
    }

    return (
        <div className={styles.tillegg}>
            <div>
                <AvtaltMarkering visible={avtalt} />
                <IkkeDeltMarkering visible={ikkeDelt} />
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

const mapStateToProps = (state: any, props: any) => {
    const { aktivitet } = props;
    return {
        aktivitet:
            props.aktivitet,
        manglerReferat:
            aktivitet.type === SAMTALEREFERAT_TYPE && selectErVeileder(state) && !aktivitet.erReferatPublisert,
        manglerDialog:
            aktivitet.type === MOTE_TYPE && selectErVeileder(state) && !selectDialogForAktivitetId(state, aktivitet.id),
    };
};

export default connect(mapStateToProps)(AktivitetskortTillegg);
