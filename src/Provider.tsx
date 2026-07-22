import React, { Dispatch, useContext, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as ReduxProvider } from 'react-redux';

import { ER_INTERN_FLATE } from './constant';
import FeatureToggle from './moduler/feature/FeatureToggle';
import createStore from './store/store';
import { RootState } from './store/rootReducer';

interface Props {
    children: React.ReactNode;
    setFnrRef?: (setFnr: Dispatch<string>) => void;
    setAktivEnhetRef?: (setAktivEnhet: Dispatch<string>) => void;
    fnr?: string;
    aktivEnhet?: string | undefined;
    preloadedState?: RootState;
}

export const ErVeilederContext = React.createContext(false);
export const useErVeileder = (): boolean => {
    return useContext(ErVeilederContext);
};

export const FnrOgEnhetContext = React.createContext<{
    fnr: string | undefined;
    aktivEnhet: string | undefined;
}>({ fnr: undefined, aktivEnhet: undefined });
export const useFnrOgEnhetContext = () => useContext(FnrOgEnhetContext);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noOp = (_: string | undefined) => {};
const Provider = ({
    children,
    setFnrRef,
    setAktivEnhetRef,
    fnr: propFnr,
    aktivEnhet: propAktivEnhet,
    preloadedState,
}: Props) => {
    const [fnr, setFnr] = useState(propFnr);
    const [aktivEnhet, setAktivEnhet] = useState(propAktivEnhet);
    useEffect(() => {
        if (setFnrRef) setFnrRef(setFnr);
        if (setAktivEnhetRef) setAktivEnhetRef(setAktivEnhet);
        return () => {
            if (setFnrRef) {
                setFnrRef(noOp);
            }
            if (setAktivEnhetRef) {
                setAktivEnhetRef(noOp);
            }
        };
    }, []);

    const store = useMemo(() => {
        return createStore(preloadedState);
    }, [fnr, aktivEnhet]);

    return (
        <FnrOgEnhetContext.Provider value={{ fnr, aktivEnhet }}>
            <ErVeilederContext.Provider value={ER_INTERN_FLATE}>
                <ReduxProvider store={store}>
                    <DndProvider backend={HTML5Backend}>
                        <FeatureToggle>{children}</FeatureToggle>
                    </DndProvider>
                </ReduxProvider>
            </ErVeilederContext.Provider>
        </FnrOgEnhetContext.Provider>
    );
};

export default Provider;
