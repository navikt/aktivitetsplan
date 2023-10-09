import React, { Dispatch, useContext, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as ReduxProvider } from 'react-redux';

import { ER_INTERN_FLATE } from './constant';
import FeatureToggle from './moduler/feature/FeatureToggle';
import createStore from './store';

interface Props {
    children: React.ReactNode;
    setFnrRef?: (setFnr: Dispatch<string>) => void;
    fnr?: string;
}

export const ErVeilederContext = React.createContext(false);
export const useErVeileder = (): boolean => {
    return useContext(ErVeilederContext);
};
export const FnrContext = React.createContext<undefined | string>(undefined);
export const useFnr = () => useContext(FnrContext);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noOp = (_: string | undefined) => {};
const Provider = ({ children, setFnrRef, fnr: propFnr }: Props) => {
    const [fnr, setFnr] = useState(propFnr);
    useEffect(() => {
        if (setFnrRef) setFnrRef(setFnr);
        return () => {
            if (setFnrRef) {
                setFnrRef(noOp);
            }
        };
    }, []);

    const store = useMemo(createStore, [fnr]);

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
