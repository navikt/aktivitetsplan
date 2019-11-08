/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PT from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IntlProvider from './intl-provider';
import InitiellDataLast from './initiell-data-last';
import createStore from './store';

const store = createStore(window.history);

class Provider extends Component {
    render() {
        const { children } = this.props;
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
    }
}

Provider.propTypes = {
    children: PT.node.isRequired
};

export default Provider;
