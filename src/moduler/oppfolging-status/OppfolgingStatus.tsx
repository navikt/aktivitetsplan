import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { selectFeatureStatus } from '../../felles-komponenter/feature/feature-selector';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import { hentIdentitet } from '../identitet/identitet-reducer';
import { selectErVeileder, selectIdentitetId, selectIdentitetStatus } from '../identitet/identitet-selector';
import { hentOppfolging } from './oppfolging-reducer';
import {
    selectAktorId,
    selectErBrukerManuell,
    selectErUnderOppfolging,
    selectOppfolgingStatus,
    selectOppfolgingsPerioder,
    selectReservasjonKRR,
    selectServicegruppe,
} from './oppfolging-selector';
import VidereSendBrukereEllerRenderChildren from './VidereSendBrukereEllerRenderChildren';

interface Props {
    children: ReactNode;
}

const OppfolgingStatus = ({ children }: Props) => {
    const dispatch = useDispatch();

    const avhengigheter = [
        useSelector(selectOppfolgingStatus),
        useSelector(selectIdentitetStatus),
        useSelector(selectFeatureStatus),
    ];

    const erVeileder = useSelector(selectErVeileder);
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
        dispatch(hentOppfolging() as unknown as AnyAction);
        dispatch(hentIdentitet() as unknown as AnyAction);
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
