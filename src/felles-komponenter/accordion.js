import React, { Component } from 'react';
import PT from 'prop-types'
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import classNames from 'classnames';
import VisibleIfDiv from './utils/visible-if-div';
import './accordion.less';

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
        return (
            <div>
                <a
                    href="/"
                    className={classNames('accordion__link', { 'accordion__link-apen': this.state.apen })}
                    onClick={this.apne}
                >
                    <NavFrontendChevron orientasjon={this.state.apen ? 'opp' : 'ned'} className="accordion__chevron" />
                    <FormattedMessage id={this.props.labelId} />
                </a>
                <VisibleIfDiv visible={this.state.apen}>{this.props.children}</VisibleIfDiv>
            </div>
        );
    }
}

Accordion.defaultProps = {
    onClick: () => {},
    apen: false,
    children: null
};

Accordion.propTypes = {
    labelId: PT.string.isRequired,
    onClick: PT.func,
    apen: PT.bool,
    children: PT.arrayOf(PT.node)
};

export default Accordion;
