import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { useErVeileder } from '../../Provider';
import { selectIdentitetId, selectIdentitetStatus } from '../identitet/identitet-selector';
import { hentIdentitet } from '../identitet/identitet-slice';
import {
    selectAktorId,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingStatus,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
    selectServicegruppe,
} from './oppfolging-selector';
import { hentOppfolging } from './oppfolging-slice';
import VidereSendBrukereEllerRenderChildren from './VidereSendBrukereEllerRenderChildren';
import { Status } from '../../createGenericSlice';

interface Props {
    children: ReactNode;
}

const OppfolgingStatus = ({ children }: Props) => {
    const dispatch = useAppDispatch();

    const avhengigheter = [useSelector(selectOppfolgingStatus), useSelector(selectIdentitetStatus)];

    const erVeileder = useErVeileder();
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const oppfolgingsPerioder = useSelector(selectOppfolgingsPerioder);
    const manuell = useSelector(selectErBrukerManuell);
    const reservasjonKRR = useSelector(selectReservasjonKRR);
    const servicegruppe = useSelector(selectServicegruppe);
    const aktorId = useSelector(selectAktorId);
    const ident = useSelector(selectIdentitetId);

    const props = {
        erVeileder,
        underOppfolging,
        oppfolgingsPerioder,
        manuell,
        reservasjonKRR,
        servicegruppe,
        aktorId,
        ident,
    };

    useEffect(() => {
        if (avhengigheter[0] === Status.NOT_STARTED) {
            dispatch(hentOppfolging());
        }
        if (avhengigheter[1] === Status.NOT_STARTED) {
            dispatch(hentIdentitet());
        }
    }, []);

    return (
        <Innholdslaster className="mt-8" avhengigheter={avhengigheter}>
            <div className="w-full flex">
                <VidereSendBrukereEllerRenderChildren {...props}>{children}</VidereSendBrukereEllerRenderChildren>
            </div>
        </Innholdslaster>
    );
};

export default OppfolgingStatus;
