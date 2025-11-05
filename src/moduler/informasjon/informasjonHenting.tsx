import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { fetchHarFlereAktorId } from '../../api/oppfolgingAPI';
import { Status } from '../../createGenericSlice';
import { useRoutes } from '../../routing/useRoutes';
import { selectErBruker } from '../identitet/identitet-selector';
import { selectLestInformasjon, selectLestStatus } from '../lest/lest-selector';
import { INFORMASJON_MODAL_VERSJON } from './informasjon-modal';
import { useFnrOgEnhetContext } from '../../Provider';
import { captureException } from '@sentry/react';

let erVist = false;
function InformasjonsHenting() {
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const lestInfo = useSelector(selectLestInformasjon, shallowEqual);
    const erBruker = useSelector(selectErBruker, shallowEqual);

    const { fnr } = useFnrOgEnhetContext();
    useEffect(() => {
        fetchHarFlereAktorId(fnr).catch((error) => captureException(error));
    }, []);

    const { informasjonRoute, hovedsideRoute } = useRoutes();
    const { pathname } = useLocation();

    const onHovedside = pathname === hovedsideRoute();
    const videreSendTilInfo =
        lestStatus === Status.OK && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON) && onHovedside;

    if (videreSendTilInfo && erBruker && !erVist) {
        erVist = true;
        return <Navigate to={informasjonRoute()} />;
    }

    return null;
}

export default InformasjonsHenting;
