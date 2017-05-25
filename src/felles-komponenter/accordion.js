import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import classNames from 'classnames';
import VisibleIfDiv from './utils/visible-if-div';
import './accordion.less';
import VisibleIfHOC from '../hocs/visible-if';

class Accordion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apen: props.apen
        };
    }

    apne = (e) => {
        e.preventDefault();
        this.setState({
            apen: !this.state.apen
        });

        if (this.props.onClick !== undefined) {
            this.props.onClick(e);
        }
    };

    render() {
        const Chevron = VisibleIfHOC(() =>
            <a
                href="/"
                className={classNames('accordion__link', { 'accordion__link-apen': this.state.apen })}
                onClick={this.apne}
            >
                <NavFrontendChevron orientasjon={this.state.apen ? 'opp' : 'ned'} className="accordion__chevron" />
                <FormattedMessage id={this.props.labelId} />
            </a>
        );

        return (
            <div className={this.props.className}>
                <Chevron visible={!this.props.chevronIBunnen} />
                <VisibleIfDiv visible={this.state.apen}>{this.props.children}</VisibleIfDiv>
                <Chevron visible={this.props.chevronIBunnen} />
            </div>
        );
    }
}

Accordion.defaultProps = {
    onClick: () => {},
    apen: false,
    children: null,
    className: '',
    chevronIBunnen: false
};

Accordion.propTypes = {
    labelId: PT.string.isRequired,
    onClick: PT.func,
    apen: PT.bool,
    children: PT.arrayOf(PT.node),
    className: PT.string,
    chevronIBunnen: PT.bool
};

export default Accordion;
