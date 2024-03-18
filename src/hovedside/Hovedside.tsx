import React, { Suspense } from 'react';
import { Await, Outlet, useLoaderData, useNavigate } from 'react-router-dom';

import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/Navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { useRoutes } from '../routing/useRoutes';
import Aktivitetstavle from './tavle/Aktivitetstavle';
import { Heading, Loader } from '@navikt/ds-react';

const Hovedside = () => {
    const navigate = useNavigate();
    const data = useLoaderData();
    const { aktivitetRoute } = useRoutes();

    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        navigate(aktivitetRoute(aktivitetId));
    });

    return (
        <Suspense fallback={<Fallback />}>
            <Await resolve={data}>
                <main id="main" className="hovedside">
                    <div className="flex items-center flex-col h-full">
                        <HovedsideFeilmelding />
                        <Nivaa4Feilmelding />
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
            </Await>
        </Suspense>
    );
};

const Fallback = () => {
    return (
        <div>
            <Heading size="large">Laster aktivtietesplanen</Heading>
            <Loader />
        </div>
    );
};

export default Hovedside;
