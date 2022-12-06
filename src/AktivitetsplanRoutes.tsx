import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import AvbrytAktivitet from './moduler/aktivitet/avslutt/AvbrytAktivitet';
import FullforAktivitet from './moduler/aktivitet/avslutt/FullforAktivitet';
import LeggTilForm from './moduler/aktivitet/ny-aktivitet/LeggTilForm';
import NyAktivitetForm from './moduler/aktivitet/ny-aktivitet/NyAktivitetForm';
import EndreAktivitet from './moduler/aktivitet/rediger/EndreAktivitet';
import AktivitetvisningContainer from './moduler/aktivitet/visning/AktivitetvisningContainer';
import InformasjonModal from './moduler/informasjon/InformasjonModal';
import Aktivitetsmal from './moduler/mal/mal';
import AktivitetsplanPrint from './moduler/utskrift/aktivitetsplanprint';

const AktivitetsplanRouting = () => {
    return (
        <Routes>
            <Route index element={<Outlet />} />
            <Route path="/mal" element={<Aktivitetsmal />} />
            <Route path="aktivitet">
                <Route path="ny" element={<LeggTilForm />} />
                <Route path="ny/*" element={<NyAktivitetForm />} />
                <Route path="vis/:id" element={<AktivitetvisningContainer />} />
                <Route path="endre/:id" element={<EndreAktivitet />} />
                <Route path="avbryt/:id" element={<AvbrytAktivitet />} />
                <Route path="fullfor/:id" element={<FullforAktivitet />} />
            </Route>
            <Route path="/informasjon" element={<InformasjonModal />} />
            <Route path="/utskrift" element={<AktivitetsplanPrint />} />
        </Routes>
    );
};

export default AktivitetsplanRouting;
