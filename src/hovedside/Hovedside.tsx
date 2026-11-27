import React from 'react';
import { Outlet, useNavigate } from 'react-router';

import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/Navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { useRoutes } from '../routing/useRoutes';
import Aktivitetstavle from './tavle/Aktivitetstavle';
import AktivitetsplanSvg from '../moduler/verktoylinje/aktivitetsplan_svg.svg?react';
import { useErVeileder } from '../Provider';

const Hovedside = () => {
    const navigate = useNavigate();
    const { aktivitetRoute } = useRoutes();
    const erVeileder = useErVeileder();

    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        navigate(aktivitetRoute(aktivitetId));
    });

    return (
        <main id="main" className="hovedside">
            <div className="flex items-center flex-col w-full h-full">
                <HovedsideFeilmelding />
                <InformasjonsHenting />
                <Varslinger />
                <div className="container relative flex flex-col items-center gap-y-4">
                    {!erVeileder && (
                        <div className="absolute hidden h-20 w-20 shrink-0 lg:-left-24 lg:mt-8 lg:block">
                            <AktivitetsplanSvg className="h-20 w-20" aria-hidden="true" />
                        </div>
                    )}
                    <div className="flex w-full flex-col items-center gap-y-4">
                        <Navigasjonslinje />
                        <Maal />
                        <div className="mt-6 w-full">
                            <Verktoylinje />
                        </div>
                    </div>
                </div>
                <Aktivitetstavle />
                <Outlet />
            </div>
        </main>
    );
};

export default Hovedside;
