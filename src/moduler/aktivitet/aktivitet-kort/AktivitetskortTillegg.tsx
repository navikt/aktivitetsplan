import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { Henvendelse } from '../../../datatypes/dialogTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import DelCvIkkeSvart, { SkalDelCvIkkeSvartVises } from '../del-cv-ikke-svart/DelCvIkkeSvart';
import EksterneEtiketter from '../etikett/EksterneEtikett';
import StillingEtikett from '../etikett/StillingEtikett';
import StillingFraNavEtikett from '../etikett/StillingFraNavEtikett';
import TiltakEtikett from '../etikett/TiltakEtikett';
import ReferatIkkeDelt, {
    SkalIkkeDeltFerdigMarkeringVises,
} from '../ikke-delt-ferdig-markering/IkkeDeltFerdigMarkering';
import DialogIkon from '../visning/underelement-for-aktivitet/dialog/DialogIkon';
import styles from './Aktivitetskort.module.less';
import UlestAvtaltMarkering from './UlestAvtaltMarkering';

interface Props {
    aktivitet: AlleAktiviteter;
}

const AktivitetskortTillegg = ({ aktivitet }: Props) => {
    const { avtalt, etikett } = aktivitet;
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, aktivitet), shallowEqual);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const ulesteHenvendelser = henvendelser.filter((h: Henvendelse) => !h.lest).length;

    const hasReferat =
        aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ||
        aktivitet.type === VeilarbAktivitetType.MOTE_TYPE;
    const deltFerdigMarkeringSkalVises = hasReferat ? SkalIkkeDeltFerdigMarkeringVises(aktivitet) : false;

    const isStillingFraNav = aktivitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;
    const svartMarkeringSkalVises = isStillingFraNav ? SkalDelCvIkkeSvartVises(aktivitet) : false;
    const stillingFraNavSoknadsstatus = isStillingFraNav ? aktivitet.stillingFraNavData.soknadsstatus : undefined;

    const isEksternAktivitet = aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
    const eksterneEtiketter = isEksternAktivitet ? aktivitet.eksternAktivitet.etiketter : undefined;

    if (
        !(
            avtalt ||
            !!etikett ||
            !!dialog ||
            deltFerdigMarkeringSkalVises ||
            svartMarkeringSkalVises ||
            !!stillingFraNavSoknadsstatus ||
            !!eksterneEtiketter
        )
    ) {
        return null;
    }

    return (
        <div className={styles.tillegg}>
            <div>
                <DelCvIkkeSvart visible={svartMarkeringSkalVises} />
                <div className={styles.etikettWrapper}>
                    <UlestAvtaltMarkering aktivitet={aktivitet} />
                    <ReferatIkkeDelt visible={deltFerdigMarkeringSkalVises} />
                    <StillingEtikett aktivitet={aktivitet} className={styles.etikett} />
                    <TiltakEtikett aktivitet={aktivitet} className={styles.etikett} />
                    <StillingFraNavEtikett
                        hidden={!stillingFraNavSoknadsstatus}
                        etikett={stillingFraNavSoknadsstatus}
                        className={styles.etikett}
                    />
                    {aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE ? (
                        <EksterneEtiketter aktivitet={aktivitet} className={styles.etikett} />
                    ) : null}
                </div>
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
};

export default AktivitetskortTillegg;
