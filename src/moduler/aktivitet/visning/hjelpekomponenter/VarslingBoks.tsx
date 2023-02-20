import { Alert } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE } from '../../../../constant';
import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import { useErBrukerDigital } from '../../../../felles-komponenter/hooks/useBrukerDigital';
import Innholdslaster from '../../../../felles-komponenter/utils/Innholdslaster';
import { selectDialogForAktivitetId, selectDialogStatus } from '../../../dialog/dialog-selector';
import { selectErVeileder, selectIdentitetStatus } from '../../../identitet/identitet-selector';

interface Props {
    className: string;
    aktivitet: AlleAktiviteter;
}

const VarslingBoks = ({ className, aktivitet }: Props) => {
    const identitetStatus = useSelector(selectIdentitetStatus);
    const dialogStatus = useSelector(selectDialogStatus);
    const avhengigheter = [identitetStatus, dialogStatus];

    const erVeileder = useSelector(selectErVeileder);
    const dialogForAktivitetId = useSelector((state) => selectDialogForAktivitetId(state, aktivitet));
    const erDigital = useErBrukerDigital();
    const erAlleredeVarslet =
        aktivitet.avtalt &&
        aktivitet.forhaandsorientering &&
        aktivitet.forhaandsorientering.type !== ForhaandsorienteringType.IKKE_SEND;

    const visVarselOmManglendeDialog =
        aktivitet.type === MOTE_TYPE && erVeileder && !dialogForAktivitetId && erDigital && !erAlleredeVarslet;

    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv className={className} hidden={!visVarselOmManglendeDialog}>
                    <Alert variant="warning">
                        Brukeren får ikke automatisk beskjed om at aktiviteten er opprettet. <br />
                        Send en dialogmelding slik at bruker får informasjon om møtet.
                    </Alert>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
};

export default VarslingBoks;
