import React, { Suspense, useEffect } from 'react';
import { Await, Outlet, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';

import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import { hentDialoger } from '../moduler/dialog/dialog-slice';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import OppfolgingStatus from '../moduler/oppfolging-status/OppfolgingStatus';
import { hentEskaleringsvarsel } from '../moduler/varslinger/eskaleringsvarsel-slice';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/Navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { useRoutes } from '../routing/routes';
import Aktivitetstavle from './tavle/Aktivitetstavle';
import { ErrorCleanerOnRouteChange } from '../routing/routingConfig';
import { Heading, Loader } from '@navikt/ds-react';

const Hovedside = () => {
    const navigate = useNavigate();
    const navigation = useNavigation();
    console.log({ navigation });
    const loaderData = useLoaderData();
    console.log({ loaderData });
    const { aktivitetRoute } = useRoutes();
    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        navigate(aktivitetRoute(aktivitetId));
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch(hentDialoger());
        dispatch(hentEskaleringsvarsel());
    }, []);

    return (
        <Suspense fallback={<Fallback />}>
            <Await resolve={loaderData}>
                <main id="main" className="hovedside">
                    <div className="flex items-center flex-col h-full">
                        <HovedsideFeilmelding />
                        <Nivaa4Feilmelding />
                        <OppfolgingStatus>
                            <InformasjonsHenting />
                            <Varslinger />
                            <div className="container flex flex-col gap-y-6">
                                <Navigasjonslinje />
                                <Maal />
                                <Verktoylinje />
                            </div>
                            <Aktivitetstavle />
                        </OppfolgingStatus>
                        <Outlet />
                    </div>
                    <ErrorCleanerOnRouteChange />
                </main>
            </Await>
        </Suspense>
    );
};

const Fallback = () => {
    console.log('Fallback');
    return (
        <div>
            <Heading size="large">Laster aktivtietesplanene</Heading>
            <Loader />
        </div>
    );
};

export default Hovedside;
