/* eslint-disable */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class NAVSPA {
    static eksporter(name, component) {
        NAVSPA.scope[name] = (element, props) => {
            ReactDOM.render(React.createElement(component, props), element);
        };
    }

    static importer(name) {
        class NAVSPAImporter extends Component {
            componentDidMount() {
                NAVSPA.scope[name](this.el, this.props);
            }

            componentWillUnmount() {
                ReactDOM.unmountComponentAtNode(this.el);
            }

            render() {
                return <div ref={(el) => (this.el = el)} />;
            }
        }

        return NAVSPAImporter;
    }

    static render(name, element, props) {
        NAVSPA.scope[name](element, props);
    }

    static scope = (window.NAVSPA = window.NAVSPA || {});
}
