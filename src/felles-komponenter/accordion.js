import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import Collapse from 'react-collapse';
import classNames from 'classnames';
import VisibleIfDiv from './utils/visible-if-div';

// TODO: Remove this and use Lesmerpanel i nav-frontend
class Accordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: props.apen,
        };
    }

    apne = e => {
        e.preventDefault();
        const { onClick } = this.props;
        const { apen } = this.state;

        this.setState({
            apen: !apen,
        });

        if (onClick !== undefined) {
            onClick(e);
        }
    };

    render() {
        const { apen } = this.state;
        const { labelId, className, children } = this.props;

        const ChevronLink = (
            <a
                href="/"
                className={classNames('accordion__link', {
                    'accordion__link-apen': apen,
                })}
                onClick={this.apne}
            >
                <FormattedMessage id={labelId} />
                <NavFrontendChevron
                    type={apen ? 'opp' : 'ned'}
                    className={classNames('accordion__chevron')}
                />
            </a>
        );

        return (
            <div className={className}>
                <Collapse isOpened={apen}>
                    <VisibleIfDiv visible={apen}>
                        {children}
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
