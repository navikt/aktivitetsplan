import React from 'react';
import PT from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IntlProvider from './intl-provider';
import componentize from './componentize';
import FnrProvider from './bootstrap/fnr-provider';

import createStore from './store';
import history from './history';

const store = createStore(history);

function Provider({ children }) {
    return (
        <ReduxProvider store={store}>
            <IntlProvider defaultLocale="nb" locale="nb" messages={{}}>
                <FnrProvider>
                    {children}
                </FnrProvider>
            </IntlProvider>
        </ReduxProvider>
    );
}

Provider.propTypes = {
    children: PT.node.isRequired,
};

export default DragDropContext(HTML5Backend)(componentize()(Provider));
