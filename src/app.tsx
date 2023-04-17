import PT from 'prop-types';
import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router-dom';

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
import Provider from './Provider';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf } from './utils/utils';

const getBasename = (fnr: string) => {
    const pathnamePrefix = import.meta.env.BASE_URL;
    if (fnr && !pathnamePrefix) {
        return fnr;
    } else if (fnr && pathnamePrefix) {
        return `${pathnamePrefix}/${fnr}`.replace('/', ''); // Replace prepending slash
    } else if (pathnamePrefix) {
        return pathnamePrefix;
    } else {
        return undefined;
    }
};

const Router = ({ fnr, children }: { fnr?: string; children: React.ReactNode }) => {
    if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
        return <HashRouter basename={fnr}>{children}</HashRouter>;
    }

    const basename = fnr ? getBasename(fnr) : undefined;
    return <BrowserRouter basename={basename}>{children}</BrowserRouter>;
};

const ErrorCleanerOnRouteChange = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fjernDismissableErrors());
    }, [location]);
    return null;
};

function App({ fnr }: { fnr?: string }) {
    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <Provider erVeileder={fnr !== undefined} key={fnr}>
                <div className="aktivitetsplan-wrapper w-full">
                    <Router fnr={fnr}>
                        <Routes>
                            <Route path="/utskrift" element={<AktivitetsplanPrint />} />
                            <Route path="/" element={<Hovedside />}>
                                <Route path={'/mal'} element={<Aktivitetsmal />} />
                                <Route path={'/informasjon'} element={<InformasjonModal />} />
                                <Route path={'/aktivitet'}>
                                    <Route path={`ny`} element={<LeggTilForm />} />
                                    <Route path={`ny/*`} element={<NyAktivitetForm />} />
                                    <Route path={`vis/:id`} element={<AktivitetvisningContainer />} />
                                    <Route path={`endre/:id`} element={<EndreAktivitet />} />
                                    <Route path={`avbryt/:id`} element={<AvbrytAktivitet />} />
                                    <Route path={`fullfor/:id`} element={<FullforAktivitet />} />
                                </Route>
                            </Route>
                        </Routes>
                        <ErrorCleanerOnRouteChange />
                    </Router>
                    <HiddenIf hidden={ER_INTERN_FLATE}>
                        <Timeoutbox />
                    </HiddenIf>
                </div>
                <UpdateEventHandler />
            </Provider>
        </div>
    );
}

export default App;
