import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, useLocation, useParams } from 'react-router-dom';

import { AKTIVITETSPLAN_ROOT_NODE_ID, ER_INTERN_FLATE } from './constant';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import Timeoutbox from './felles-komponenter/timeoutbox/Timeoutbox';
import Hovedside from './hovedside/Hovedside';
import AvbrytAktivitet from './moduler/aktivitet/avslutt/AvbrytAktivitet';
import FullforAktivitet from './moduler/aktivitet/avslutt/FullforAktivitet';
import LeggTilForm from './moduler/aktivitet/ny-aktivitet/LeggTilForm';
import NyAktivitetForm from './moduler/aktivitet/ny-aktivitet/NyAktivitetForm';
import EndreAktivitet from './moduler/aktivitet/rediger/EndreAktivitet';
import AktivitetvisningContainer from './moduler/aktivitet/visning/AktivitetvisningContainer';
import { fjernDismissableErrors } from './moduler/feilmelding/feil-slice';
import InformasjonModal from './moduler/informasjon/informasjon-modal';
import Aktivitetsmal from './moduler/mal/mal';
import AktivitetsplanPrint from './moduler/utskrift/AktivitetsplanPrint';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf } from './utils/utils';
import { JournalforingPage } from './moduler/journalforing/JournalforingPage';
import { BasePage } from './BasePage';

const Router = ({ children }: { children: React.ReactNode }) => {
    if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
        return <HashRouter>{children}</HashRouter>;
    }
    return <BrowserRouter>{children}</BrowserRouter>;
};

const ErrorCleanerOnRouteChange = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fjernDismissableErrors());
    }, [location]);
    return null;
};

function App({ Routes }: { Routes: any }) {
    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <div className="aktivitetsplan-wrapper w-full">
                <Router>
                    <Routes>
                        <Route path={`/`} element={<BasePage />}>
                            <Route path="utskrift" element={<AktivitetsplanPrint />} />
                            <Route path="journalforing" element={<JournalforingPage />} />
                            <Route path="" element={<Hovedside />}>
                                <Route path={'mal'} element={<Aktivitetsmal />} />
                                <Route path={'informasjon'} element={<InformasjonModal />} />
                                <Route path={'aktivitet'}>
                                    <Route path={`ny`} element={<LeggTilForm />} />
                                    <Route path={`ny/*`} element={<NyAktivitetForm />} />
                                    <Route path={`vis/:id`} element={<AktivitetvisningContainer />} />
                                    <Route path={`endre/:id`} element={<EndreAktivitet />} />
                                    <Route path={`avbryt/:id`} element={<AvbrytAktivitet />} />
                                    <Route path={`fullfor/:id`} element={<FullforAktivitet />} />
                                </Route>
                            </Route>
                        </Route>
                        {/* Brukes for å ikke brekke lenker fra dialoger til aktiviteter inn fnr er helt ute av urler */}
                        <Route path="/:fnr/aktivitet/vis/:id" element={<RedirectToAktivitetWithoutFnr />} />
                        <Route path="*" element={<Navigate replace to={`/`} />} />
                    </Routes>
                    <ErrorCleanerOnRouteChange />
                </Router>
                <HiddenIf hidden={ER_INTERN_FLATE}>
                    <Timeoutbox />
                </HiddenIf>
            </div>
            <UpdateEventHandler />
        </div>
    );
}

const RedirectToAktivitetWithoutFnr = () => {
    const params = useParams();
    return <Navigate replace to={`/aktivitet/vis/` + params.id} />;
};

export default App;
