import React, { useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { AnyAction } from 'redux';

import { fetchHarFlereAktorId } from '../../api/oppfolgingAPI';
import { STATUS } from '../../api/utils';
import { loggTidBruktGaaInnPaaAktivitetsplanen } from '../../felles-komponenter/utils/logging';
import { useRoutes } from '../../routes';
import { selectErBruker } from '../identitet/identitet-selector';
import { hentLest, selectLestInformasjon, selectLestStatus } from '../lest/lest-reducer';
import { selectErUnderOppfolging, selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { INFORMASJON_MODAL_VERSJON } from './informasjon-modal';

let erVist = false;
function InformasjonsHenting() {
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const lestInfo = useSelector(selectLestInformasjon, shallowEqual);
    const erBruker = useSelector(selectErBruker, shallowEqual);
    const oppfolgingsPerioder = useSelector(selectOppfolgingsPerioder, shallowEqual);

    const dispatch = useDispatch();
    const doHentLest = useCallback(() => dispatch(hentLest() as unknown as AnyAction), [dispatch]);

    useEffect(() => {
        fetchHarFlereAktorId();
        if (underOppfolging) {
            doHentLest().then((a: any) => {
                loggTidBruktGaaInnPaaAktivitetsplanen(a.data, oppfolgingsPerioder);
            });
        }
        // eslint-disable-next-line
    }, []);

    const { informasjonRoute, hovedsideRoute } = useRoutes();
    const { pathname } = useLocation();

    const onHovedside = pathname === hovedsideRoute();
    const videreSendTilInfo =
        lestStatus === STATUS.OK && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON) && onHovedside;

    if (videreSendTilInfo && erBruker && !erVist) {
        erVist = true;
        return <Navigate to={informasjonRoute()} />;
    }

    return null;
}

export default InformasjonsHenting;
