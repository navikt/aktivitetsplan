import React, { useCallback, useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { AnyAction } from 'redux';

import { fetchHarFlereAktorId } from '../../api/oppfolgingAPI';
import { STATUS } from '../../api/utils';
import { loggTidBruktGaaInnPaaAktivitetsplanen } from '../../felles-komponenter/utils/logging';
import { selectErBruker } from '../identitet/identitet-selector';
import { hentLest, selectLestInformasjon, selectLestStatus } from '../lest/lest-reducer';
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

    const dispatch = useDispatch();
    const doHentLest = useCallback(() => dispatch(hentLest() as unknown as AnyAction), [dispatch]);
    const setBack = (path: string) => dispatch(setBackPath(path));

    useEffect(() => {
        fetchHarFlereAktorId();

        if (underOppfolging) {
            // @ts-ignore
            doHentLest().then((a) => {
                loggTidBruktGaaInnPaaAktivitetsplanen(a.data, oppfolgingsPerioder);
            });
        }
        // eslint-disable-next-line
    }, []);

    const { pathname } = useLocation();

    const correctUrl = pathname === '/';
    const videreSendTilInfo =
        lestStatus === STATUS.OK && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON) && correctUrl;

    if (videreSendTilInfo && erBruker && !ref.current) {
        ref.current = true;
        setBack(pathname);
        return <Navigate to={redirectPath} />;
    }

    return null;
}

export default InformasjonsHenting;
