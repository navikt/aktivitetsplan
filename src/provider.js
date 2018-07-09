import React, { Component } from 'react';
import PT from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IntlProvider from './intl-provider';
import InitiellDataLast from './initiell-data-last';
import componentize from './componentize';

import createStore from './store';
import history from './history';

class Provider extends Component {
    constructor(props) {
        super(props);
        this.store = createStore(history);
    }

    render() {
        return (
            <ReduxProvider store={this.store}>
                <InitiellDataLast>
                    <IntlProvider defaultLocale="nb" locale="nb" messages={{}}>
                        <div>
                            {this.props.children}
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
