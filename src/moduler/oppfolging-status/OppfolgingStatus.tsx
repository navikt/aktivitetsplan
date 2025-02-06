import React, { ReactNode } from 'react';
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
