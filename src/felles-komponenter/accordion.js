import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import Collapse from 'react-collapse';
import classNames from 'classnames';
import VisibleIfDiv from './utils/visible-if-div';

class Accordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: props.apen,
        };

        this.apne = this.apne.bind(this);
    }

    apne(e) {
        e.preventDefault();
        this.setState({
            apen: !this.state.apen,
        });

        if (this.props.onClick !== undefined) {
            this.props.onClick(e);
        }
    }

    render() {
        const ChevronLink = (
            <a
                href="/"
                className={classNames('accordion__link', {
                    'accordion__link-apen': this.state.apen,
                })}
                onClick={this.apne}
            >
                <FormattedMessage id={this.props.labelId} />
                <NavFrontendChevron
                    type={this.state.apen ? 'opp' : 'ned'}
                    className={classNames('accordion__chevron')}
                />
            </a>
        );

        return (
            <div className={this.props.className}>
                <Collapse isOpened={this.state.apen}>
                    <VisibleIfDiv visible={this.state.apen}>
                        {this.props.children}
                    </VisibleIfDiv>
                </Collapse>
                {ChevronLink}
            </div>
        );
    }
}

Accordion.defaultProps = {
    onClick: () => {},
    apen: false,
    children: null,
    className: '',
};

Accordion.propTypes = {
    labelId: PT.string.isRequired,
    onClick: PT.func,
    apen: PT.bool,
    children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]),
    className: PT.string,
};

export default Accordion;
