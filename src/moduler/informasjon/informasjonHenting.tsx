import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { fetchHarFlereAktorId } from '../../api/oppfolgingAPI';
import { Status } from '../../createGenericSlice';
import { Lest } from '../../datatypes/lestTypes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { loggTidBruktGaaInnPaaAktivitetsplanen } from '../../felles-komponenter/utils/logging';
import { selectErBruker } from '../identitet/identitet-selector';
import { selectLestInformasjon, selectLestStatus } from '../lest/lest-selector';
import { fetchLest } from '../lest/lest-slice';
import { selectErUnderOppfolging, selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { INFORMASJON_MODAL_VERSJON } from './informasjon-modal';
import { setBackPath } from './informasjon-reducer';

const redirectPath = '/informasjon';

function InformasjonsHenting() {
    const ref = useRef(false);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const lestInfo = useSelector(selectLestInformasjon, shallowEqual);
    const erBruker = useSelector(selectErBruker, shallowEqual);
    const oppfolgingsPerioder = useSelector(selectOppfolgingsPerioder, shallowEqual);

    const dispatch = useAppDispatch();
    const setBack = (path: string) => dispatch(setBackPath(path));

    useEffect(() => {
        fetchHarFlereAktorId();

        if (underOppfolging) {
            dispatch(fetchLest()).then((action) => {
                loggTidBruktGaaInnPaaAktivitetsplanen(action.payload as Lest[], oppfolgingsPerioder);
            });
        }
    }, []);

    const { pathname } = useLocation();

    const correctUrl = pathname === '/';
    const videreSendTilInfo =
        lestStatus === Status.OK && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON) && correctUrl;

    if (videreSendTilInfo && erBruker && !ref.current) {
        ref.current = true;
        setBack(pathname);
        return <Navigate to={redirectPath} />;
    }

    return null;
}

export default InformasjonsHenting;
