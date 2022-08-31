import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { Henvendelse } from '../../../datatypes/dialogTypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import DelCvIkkeSvart, { SkalDelCvIkkeSvartVises } from '../del-cv-ikke-svart/DelCvIkkeSvart';
import StillingEtikett from '../etikett/StillingEtikett';
import StillingFraNavEtikett from '../etikett/StillingFraNavEtikett';
import TiltakEtikett from '../etikett/TiltakEtikett';
import ReferatIkkeDelt, {
    SkalIkkeDeltFerdigMarkeringVises,
} from '../ikke-delt-ferdig-markering/IkkeDeltFerdigMarkering';
import DialogIkon from '../visning/underelement-for-aktivitet/dialog/DialogIkon';
import styles from './Aktivitetskort.module.css';
import UlestAvtaltMarkering from './UlestAvtaltMarkering';

interface Props {
    aktivitet: Aktivitet;
}

const AktivitetskortTillegg = ({ aktivitet }: Props) => {
    const { avtalt, id, etikett } = aktivitet;
    const dialog = useSelector((state) => selectDialogForAktivitetId(state, id), shallowEqual);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const ulesteHenvendelser = henvendelser.filter((h: Henvendelse) => !h.lest).length;
    const deltFerdigMarkeringSkalVises = SkalIkkeDeltFerdigMarkeringVises(aktivitet);
    const svartMarkeringSkalVises = SkalDelCvIkkeSvartVises(aktivitet);
    const stillingFraNavSoknadsstatus = aktivitet.stillingFraNavData?.soknadsstatus;

    if (
        !(
            avtalt ||
            !!etikett ||
            !!dialog ||
            deltFerdigMarkeringSkalVises ||
            svartMarkeringSkalVises ||
            !!stillingFraNavSoknadsstatus
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
