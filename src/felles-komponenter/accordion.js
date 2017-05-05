import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import classNames from 'classnames';
import { visibleIfHOC } from '../hocs/visible-if';
import './accordion.less';

const VisibleDiv = visibleIfHOC((props) => <div {...props} />);

class Accordion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apen: false
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
                <VisibleDiv visible={this.state.apen}>{this.props.children}</VisibleDiv>
            </div>
        );
    }
}

Accordion.defaultProps = {
    onClick: () => {},
    children: null
};

Accordion.propTypes = {
    labelId: PT.string.isRequired,
    onClick: PT.func,
    children: PT.string
};

export default Accordion;
