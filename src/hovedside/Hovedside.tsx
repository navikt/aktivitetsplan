import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/Navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { useRoutes } from '../routing/useRoutes';
import Aktivitetstavle from './tavle/Aktivitetstavle';
import { Loader } from '@navikt/ds-react';

const Hovedside = () => {
    const navigate = useNavigate();
    const { aktivitetRoute } = useRoutes();

    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        navigate(aktivitetRoute(aktivitetId));
    });

    return (
        <main id="main" className="hovedside">
            <div className="flex items-center flex-col h-full">
                <HovedsideFeilmelding />
                <InformasjonsHenting />
                <Varslinger />
                <div className="container flex flex-col gap-y-6">
                    <Navigasjonslinje />
                    <Maal />
                    <Verktoylinje />
                </div>
                <Aktivitetstavle />
                <Outlet />
            </div>
        </main>
    );
};

export const PageLoader = () => {
    // const { data } = useLoaderData();
    return (
        // <Suspense fallback={<Fallback />}>
        //     <Await resolve={data}>
        <Outlet />
        // </Await>
        // </Suspense>
    );
};

const Fallback = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Loader size="2xlarge" />
        </div>
    );
};

export default Hovedside;
