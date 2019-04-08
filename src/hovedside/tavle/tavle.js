import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';
import SprettendeScrollbars from './sprettende-scrollbars';
import { autobind } from '../../utils';

const KOLONNEBREDDE = 300;
const KOLONNEMARGIN = 10;
const tavleClassname = className => classNames('tavle', className);

class Tavle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            clickIndex: 0,
            venstreKnappDisabled: true,
            hoyreKnappDisabled: false,
        };
        autobind(this);
    }

    visForrige() {
        const clickIndex =  Math.min(this.state.currentIndex, this.state.clickIndex) - 1
        const scrollTo = clickIndex * KOLONNEBREDDE;
        this.scrollbars.scrollLeft(scrollTo);
        this.setState({clickIndex: clickIndex});
    }

    visNeste() {
        const clientWidth = this.scrollbars.getClientWidth();
        const scrollLeft = this.scrollbars.getScrollLeft();
        const clientWidthWithOffset = clientWidth + KOLONNEMARGIN;
        const nesteIndex = Math.floor(
            (clientWidthWithOffset + scrollLeft) / KOLONNEBREDDE
        );
        const clickIndex = Math.max(nesteIndex, this.state.clickIndex) + 1;
        const scrollTo =
            clickIndex * KOLONNEBREDDE - clientWidthWithOffset;
        this.scrollbars.scrollLeft(scrollTo);
        this.setState({clickIndex: clickIndex});
    }

    updateState(values) {
        this.setState({
            currentIndex: Math.ceil(values.scrollLeft / KOLONNEBREDDE),
            venstreKnappDisabled: values.left === 0,
            hoyreKnappDisabled: values.left >= 0.99,
        });
    }

    render() {
        const { children, className, intl } = this.props;
        const kolonner = children.map((child, index) =>
            <section
                key={child.key || index}
                className="tavle-kolonne"
                data-testId={`aktivitetstavle.${child.props.status}`}
            >
                {child}
            </section>
        );

        const venstreKnapp = (
            <button
                className={classNames('tavle__scrollknapp knapp-forrige', {
                    invisible: this.state.venstreKnappDisabled,
                })}
                onClick={this.visForrige}
                disabled={this.state.venstreKnappDisabled}
                aria-label={intl.formatMessage({
                    id: 'aktivitetstavle.scrollknapp.forrige.label',
                })}
            />
        );

        const hoyreKnapp = (
            <button
                className={classNames('tavle__scrollknapp knapp-neste', {
                    invisible: this.state.hoyreKnappDisabled,
                })}
                onClick={this.visNeste}
                hidden={this.state.hoyreKnappDisabled}
                aria-label={intl.formatMessage({
                    id: 'aktivitetstavle.scrollknapp.neste.label',
                })}
            />
        );

        return (
            <section className={tavleClassname(className)} tabIndex="0">
                {venstreKnapp}
                <SprettendeScrollbars
                    renderTrackHorizontal={() => <div />}
                    className="tavle__scrollarea"
                    autoHeight
                    autoHeightMax={9999}
                    onScrollFrame={this.updateState}
                    ref={scrollbars => {
                        this.scrollbars = scrollbars;
                    }}
                >
                    <div className="kolonner">
                        {kolonner}
                    </div>
                </SprettendeScrollbars>
                {hoyreKnapp}
            </section>
        );
    }
}

Tavle.propTypes = {
    className: PT.string,
    children: PT.arrayOf(PT.element).isRequired,
    intl: intlShape.isRequired,
};

Tavle.defaultProps = {
    className: '',
};

export default injectIntl(Tavle);
