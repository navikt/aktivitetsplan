import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { STILLING_AKTIVITET_TYPE } from '../../../constant';
import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { Henvendelse } from '../../../datatypes/dialogTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId } from '../../dialog/dialog-selector';
import DelCvIkkeSvart, { SkalDelCvIkkeSvartVises } from '../del-cv-ikke-svart/DelCvIkkeSvart';
import EksterneEtiketter from '../etikett/EksterneEtikett';
import StillingEtikett from '../etikett/StillingEtikett';
import StillingFraNavEtikett from '../etikett/StillingFraNavEtikett';
import TiltakEtikett from '../etikett/TiltakEtikett';
import IkkeDeltFerdigMarkering, {
    SkalIkkeDeltFerdigMarkeringVises,
} from '../ikke-delt-ferdig-markering/IkkeDeltFerdigMarkering';
import DialogIkon from '../visning/underelement-for-aktivitet/dialog/DialogIkon';
import styles from './Aktivitetskort.module.less';
import UlestAvtaltMarkering from './UlestAvtaltMarkering';
import { Tag } from '@navikt/ds-react';

interface Props {
    aktivitet: AlleAktiviteter;
}

const AktivitetskortTillegg = ({ aktivitet }: Props) => {
    const { avtalt, etikett } = aktivitet;
    const dialog = useSelector(selectDialogForAktivitetId(aktivitet.id), shallowEqual);
    const henvendelser = dialog ? dialog.henvendelser : [];
    const ulesteHenvendelser = henvendelser.filter((h: Henvendelse) => !h.lest).length;

    const hasReferat =
        aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ||
        aktivitet.type === VeilarbAktivitetType.MOTE_TYPE;
    const deltFerdigMarkeringSkalVises = hasReferat ? SkalIkkeDeltFerdigMarkeringVises(aktivitet) : false;

    const isStillingFraNav = aktivitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;
    const svartMarkeringSkalVises = isStillingFraNav ? SkalDelCvIkkeSvartVises(aktivitet) : false;
    const stillingFraNavSoknadsstatus = isStillingFraNav ? aktivitet.stillingFraNavData.soknadsstatus : undefined;
    const isKassert = isVeilarbAktivitet(aktivitet) && aktivitet.transaksjonsType === 'KASSERT';

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
        <div className="flex justify-between mt-2 w-full">
            <div>
                {svartMarkeringSkalVises ? <DelCvIkkeSvart /> : null}
                <div className="flex flex-col gap-y-1 items-start">
                    <UlestAvtaltMarkering aktivitet={aktivitet} />
                    {deltFerdigMarkeringSkalVises ? <IkkeDeltFerdigMarkering /> : null}
                    {aktivitet.type === STILLING_AKTIVITET_TYPE ? <StillingEtikett aktivitet={aktivitet} /> : null}
                    {isArenaAktivitet(aktivitet) ? <TiltakEtikett aktivitet={aktivitet} /> : null}
                    {stillingFraNavSoknadsstatus ? (
                        <StillingFraNavEtikett soknadsstatus={stillingFraNavSoknadsstatus} />
                    ) : null}
                    {aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE ? (
                        <EksterneEtiketter aktivitet={aktivitet} />
                    ) : null}
                    {isKassert && <Tag size={'small'} variant={"neutral-filled"}>Kassert</Tag> }
                </div>
            </div>

            <HiddenIfDiv hidden={!dialog && henvendelser.length <= 0} className="h-0 self-end">
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
