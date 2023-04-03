import React, { Dispatch, useContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as ReduxProvider } from 'react-redux';

import InitiellDataLast from './InitiellDataLast';
import createStore from './store';

const store = createStore();

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

const Provider = ({ children, setFnrRef, fnr: propFnr }: Props) => {
    const [fnr, setFnr] = useState(propFnr);
    useEffect(() => {
        if (setFnrRef) setFnrRef(setFnr);
    }, []);

    return (
        <FnrContext.Provider value={fnr}>
            <ErVeilederContext.Provider value={fnr !== undefined}>
                <ReduxProvider store={store}>
                    <DndProvider backend={HTML5Backend}>
                        <InitiellDataLast>{children}</InitiellDataLast>
                    </DndProvider>
                </ReduxProvider>
            </ErVeilederContext.Provider>
        </FnrContext.Provider>
    );
};

export default Provider;
