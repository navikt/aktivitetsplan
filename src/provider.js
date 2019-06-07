import React, { Component } from 'react';
import PT from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IntlProvider from './intl-provider';
import InitiellDataLast from './initiell-data-last';
import componentize from './componentize';
import { RESET_STORE } from './reducer';
import createStore from './store';

const store = createStore(window.history);

class Provider extends Component {
    constructor(props) {
        super(props);
        store.dispatch(RESET_STORE);
    }

    render() {
        const {children} = this.props;
        return (
            <ReduxProvider store={store}>
                <InitiellDataLast>
                    <IntlProvider defaultLocale="nb" locale="nb" messages={{}}>
                        <div>
                            {children}
                        </div>
                    </IntlProvider>
                </InitiellDataLast>
            </ReduxProvider>
        );
    }
}

Provider.propTypes = {
    children: PT.node.isRequired,
};

export default DragDropContext(HTML5Backend)(componentize()(Provider));
