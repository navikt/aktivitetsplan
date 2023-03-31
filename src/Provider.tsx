import React, { useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as ReduxProvider } from 'react-redux';

import InitiellDataLast from './InitiellDataLast';
import createStore from './store';

const store = createStore();

interface Props {
    children: React.ReactNode;
    erVeileder: boolean;
}

export const ErVeilederContext = React.createContext(false);
export const useErVeileder = (): boolean => {
    return useContext(ErVeilederContext);
};

const Provider = ({ children, erVeileder }: Props) => {
    return (
        <ErVeilederContext.Provider value={erVeileder}>
            <ReduxProvider store={store}>
                <DndProvider backend={HTML5Backend}>
                    <InitiellDataLast>{children}</InitiellDataLast>
                </DndProvider>
            </ReduxProvider>
        </ErVeilederContext.Provider>
    );
};

export default Provider;
