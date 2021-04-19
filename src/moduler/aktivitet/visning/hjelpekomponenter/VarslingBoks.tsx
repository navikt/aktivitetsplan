import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from '../../../../felles-komponenter/utils/Innholdslaster';
import { selectDialogForAktivitetId, selectDialogStatus } from '../../../dialog/dialog-selector';
import { selectErVeileder, selectIdentitetStatus } from '../../../identitet/identitet-selector';
import { selectErBrukerManuell, selectReservasjonKRR } from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';

interface Props {
    className: string;
    aktivitet: Aktivitet;
}

const VarslingBoks = ({ className, aktivitet }: Props) => {
    const identitetStatus = useSelector(selectIdentitetStatus);
    const dialogStatus = useSelector(selectDialogStatus);
    const avhengigheter = [identitetStatus, dialogStatus];

    const erVeileder = useSelector(selectErVeileder);
    const dialogForAktivitetId = useSelector((state) => selectDialogForAktivitetId(state, aktivitet.id));
    const erKRR = useSelector(selectReservasjonKRR);
    const erManuell = useSelector(selectErBrukerManuell);
    const harLoggetInnNivaa4 = useSelector(selectNivaa4);

    const visVarselOmManglendeDialog =
        aktivitet.type === MOTE_TYPE &&
        erVeileder &&
        !dialogForAktivitetId &&
        !erKRR &&
        !erManuell &&
        harLoggetInnNivaa4;

    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv className={className} hidden={!visVarselOmManglendeDialog}>
                    <AlertStripe type="advarsel">
                        Brukeren får ikke automatisk beskjed om at aktiviteten er opprettet. <br />
                        Send en dialogmelding slik at bruker får informasjon om møtet.
                    </AlertStripe>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
};

export default VarslingBoks;
