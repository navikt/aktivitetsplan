import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { useErVeileder } from '../../Provider';
import { selectIdentitetId, selectIdentitetStatus } from '../identitet/identitet-selector';
import { fetchIdentitet } from '../identitet/identitet-slice';
import {
    selectAktorId,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingStatus,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
    selectServicegruppe,
} from './oppfolging-selector';
import { fetchOppfolging } from './oppfolging-slice';
import VidereSendBrukereEllerRenderChildren from './VidereSendBrukereEllerRenderChildren';

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
        dispatch(fetchOppfolging());
        dispatch(fetchIdentitet());
    }, []);

    return (
        <Innholdslaster className="mt-8" avhengigheter={avhengigheter}>
            <div className="w-full">
                <VidereSendBrukereEllerRenderChildren {...props}>{children}</VidereSendBrukereEllerRenderChildren>
            </div>
        </Innholdslaster>
    );
};

export default OppfolgingStatus;
