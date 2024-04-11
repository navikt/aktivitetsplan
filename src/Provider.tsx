import React, { Dispatch, useContext, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as ReduxProvider } from 'react-redux';

import { ER_INTERN_FLATE } from './constant';
import FeatureToggle from './moduler/feature/FeatureToggle';
import createStore, { RootState } from './store';

interface Props {
    children: React.ReactNode;
    setFnrRef?: (setFnr: Dispatch<string>) => void;
    fnr?: string;
    setAktivEnhetRef?: (setAktivEnhet: Dispatch<string>) => void;
    aktivEnhet?: string | undefined;
    preloadedState?: RootState;
}

export const ErVeilederContext = React.createContext(false);
export const useErVeileder = (): boolean => {
    return useContext(ErVeilederContext);
};
export const FnrContext = React.createContext<undefined | string>(undefined);
export const useFnr = () => useContext(FnrContext);

export const AktivEnhetContext = React.createContext<undefined | string>(undefined);

export const useAktivEnhet = () => useContext(AktivEnhetContext);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noOp = (_: string | undefined) => {};
const Provider = ({
    children,
    setFnrRef,
    fnr: propFnr,
    setAktivEnhetRef,
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
    }, [fnr]);

    return (
        <FnrContext.Provider value={fnr}>
            <ErVeilederContext.Provider value={ER_INTERN_FLATE}>
                <ReduxProvider store={store}>
                    <DndProvider backend={HTML5Backend}>
                        <FeatureToggle>{children}</FeatureToggle>
                    </DndProvider>
                </ReduxProvider>
            </ErVeilederContext.Provider>
        </FnrContext.Provider>
    );
};

export default Provider;
