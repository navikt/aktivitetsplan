import React, { Component } from 'react';
import PT from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IntlProvider from './intl-provider';
import componentize from './componentize';
import { RESET_STORE } from './reducer';

import createStore from './store';
import history from './history';

const store = createStore(history);

class Provider extends Component {
    constructor(props) {
        super(props);
        const dispatch = store.dispatch;
        this.listener = () => {
            dispatch(RESET_STORE);
            history.replace('/');
        };
    }

    componentDidMount() {
        document.addEventListener('flate-person-endret', this.listener);
    }

    componentWillUnmount() {
        document.removeEventListener('flate-person-endret', this.listener);
    }
    render() {
        return (
            <ReduxProvider store={store}>
                <IntlProvider defaultLocale="nb" locale="nb" messages={{}}>
                    {this.props.children}
                </IntlProvider>
            </ReduxProvider>
        );
    }
}

Provider.propTypes = {
    children: PT.node.isRequired,
};

export default DragDropContext(HTML5Backend)(componentize()(Provider));
