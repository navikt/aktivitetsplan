import React from 'react';
import { AKTIVITETSPLAN_ROOT_NODE_ID, ER_INTERN_FLATE } from './constant';
import Timeoutbox from './felles-komponenter/timeoutbox/Timeoutbox';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf } from './utils/utils';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App({ Routes }: { Routes: ReturnType<typeof createBrowserRouter> }) {
    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <div className="aktivitetsplan-wrapper w-full">
                <RouterProvider router={Routes} />
                {/*<Router>*/}
                {/*    <Routes>*/}
                {/*        <Route path={`/`}>*/}
                {/*            <Route path="utskrift" element={<AktivitetsplanPrint />} />*/}
                {/*            <Route path="" element={<Hovedside />}>*/}
                {/*                <Route path={'mal'} element={<Aktivitetsmal />} />*/}
                {/*                <Route path={'informasjon'} element={<InformasjonModal />} />*/}
                {/*                <Route path={'aktivitet'}>*/}
                {/*                    <Route path={`ny`} element={<LeggTilForm />} />*/}
                {/*                    <Route path={`ny/*`} element={<NyAktivitetForm />} />*/}
                {/*                    <Route path={`vis/:id`} element={<AktivitetvisningContainer />} />*/}
                {/*                    <Route path={`endre/:id`} element={<EndreAktivitet />} />*/}
                {/*                    <Route path={`avbryt/:id`} element={<AvbrytAktivitet />} />*/}
                {/*                    <Route path={`fullfor/:id`} element={<FullforAktivitet />} />*/}
                {/*                </Route>*/}
                {/*            </Route>*/}
                {/*        </Route>*/}
                {/*        /!* Brukes for å ikke brekke lenker fra dialoger til aktiviteter inn fnr er helt ute av urler *!/*/}
                {/*        <Route path="/:fnr/aktivitet/vis/:id" element={<RedirectToAktivitetWithoutFnr />} />*/}
                {/*        <Route path="*" element={<Navigate replace to={`/`} />} />*/}
                {/*    </Routes>*/}
                {/*    <ErrorCleanerOnRouteChange />*/}
                {/*</Router>*/}
                <HiddenIf hidden={ER_INTERN_FLATE}>
                    <Timeoutbox />
                </HiddenIf>
            </div>
            <UpdateEventHandler />
        </div>
    );
}

export default App;
