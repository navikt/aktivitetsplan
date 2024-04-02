import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useErVeileder } from '../../Provider';
import { selectIdentitetId } from '../identitet/identitet-selector';
import {
    selectAktorId,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
    selectServicegruppe,
} from './oppfolging-selector';
import VidereSendBrukereEllerRenderChildren from './VidereSendBrukereEllerRenderChildren';

interface Props {
    children: ReactNode;
}

const OppfolgingStatus = ({ children }: Props) => {
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

    return (
        <div className="w-full">
            <VidereSendBrukereEllerRenderChildren {...props}>{children}</VidereSendBrukereEllerRenderChildren>
        </div>
    );
};

export default OppfolgingStatus;
