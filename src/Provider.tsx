import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as ReduxProvider } from 'react-redux';

import InitiellDataLast from './initiell-data-last';
import IntlProvider from './intl-provider';
import createStore from './store';

const store = createStore();

interface Props {
    children: React.ReactNode;
}

const Provider = ({ children }: Props) => {
    return (
        <ReduxProvider store={store}>
            <DndProvider backend={HTML5Backend}>
                <InitiellDataLast>
                    <IntlProvider defaultLocale="nb" locale="nb" messages={{}}>
                        <div>{children}</div>
                    </IntlProvider>
                </InitiellDataLast>
            </DndProvider>
        </ReduxProvider>
    );
};

export default Provider;
