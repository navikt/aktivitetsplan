import React, { Component, PropTypes as PT } from 'react';
import { guid, fn, autobind } from './utils';
import classNames from 'classnames';

const classMap = {
    hjelpetekst: (...args) => classNames('hjelpetekst', args),
    ikon: fn('hjelpetekst-ikon js-ikon'),
    tooltip: fn('hjelpetekst-tooltip js-tooltip er-synlig'),
    tittel: fn('decorated hjelpetekst-tittel js-tittel'),
    tekst: fn('hjelpetekst-tekst js-tekst'),
    lukk: fn('hjelpetekst-lukk js-hjelpetekst-lukk')
};

class Hjelpetekst extends Component {
    constructor(props) {
        super(props);

        this.state = {
            erSynlig: false
        };
        this.guid = guid();

        autobind(this);
    }

    toggleSynlighet() {
        this.setState({
            erSynlig: !this.state.erSynlig
        });
    }

    renderContent() {
        return (
            <div role="tooltip" id={this.guid} className={classMap.tooltip()}>
                <h3 className={classMap.tittel()}>
                    {this.props.tittel}
                </h3>
                <div className={classMap.tekst()}>
                    {this.props.children}
                </div>
                <button
                    onClick={this.toggleSynlighet} type="button"
                    className={classMap.lukk()} aria-controls={this.guid}
                >
                    <span className="vekk">Lukk</span>
                </button>
            </div>
        );
    }

    render() {
        const maybeContent = this.state.erSynlig ? this.renderContent() : null;
        return (
            <div className={classMap.hjelpetekst(this.props.className)}>
                <button
                    onClick={this.toggleSynlighet}
                    type="button"
                    className={classMap.ikon()}
                    aria-describedby={this.guid}
                >
                    <span aria-hidden="true">?</span>
                    <span className="vekk">? {this.props.label}</span>
                </button>
                {maybeContent}
            </div>
        );
    }
}

Hjelpetekst.propTypes = {
    label: PT.string,
    tittel: PT.string,
    children: PT.node.isRequired,
    className: PT.string
};

Hjelpetekst.defaultProps = {
    label: 'Hjelptekst',
    tittel: 'Hjelptekst'
};

export default Hjelpetekst;
