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
    return (
        <div className="w-full">
            <VidereSendBrukereEllerRenderChildren>{children}</VidereSendBrukereEllerRenderChildren>
        </div>
    );
};

export default OppfolgingStatus;
