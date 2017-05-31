import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import Collapse from 'react-collapse/src/Collapse';
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
        const ChevronLink = VisibleIfHOC(() =>
            (<a
                href="/"
                className={classNames(
                    'accordion__link',
                    this.props.linkClassName,
                    { 'accordion__link-apen': this.state.apen }
                )}
                onClick={this.apne}
            >
                {!this.props.chevronIBunnen &&
                    <NavFrontendChevron
                        orientasjon={this.state.apen ? 'opp' : 'ned'}
                        className={classNames('accordion__chevron', this.props.chevronClassName)}
                    />
                }
                <FormattedMessage id={this.props.labelId} />
                {this.props.chevronIBunnen &&
                <NavFrontendChevron
                    orientasjon={this.state.apen ? 'opp' : 'ned'}
                    className={classNames('accordion__chevron', this.props.chevronClassName)}
                />
                }
            </a>)
        );

        return (
            <div className={this.props.className}>
                <ChevronLink visible={!this.props.linkIBunnen} />
                <Collapse isOpened={this.state.apen}>
                    <VisibleIfDiv visible={this.state.apen}>{this.props.children}</VisibleIfDiv>
                </Collapse>
                <ChevronLink visible={this.props.linkIBunnen} />
            </div>
        );
    }
}

Accordion.defaultProps = {
    onClick: () => {},
    apen: false,
    children: null,
    className: '',
    linkIBunnen: false,
    chevronIBunnen: false,
    linkClassName: '',
    chevronClassName: ''
};

Accordion.propTypes = {
    labelId: PT.string.isRequired,
    onClick: PT.func,
    apen: PT.bool,
    children: PT.arrayOf(PT.node),
    className: PT.string,
    linkIBunnen: PT.bool,
    chevronIBunnen: PT.bool,
    linkClassName: PT.string,
    chevronClassName: PT.string
};

export default Accordion;
