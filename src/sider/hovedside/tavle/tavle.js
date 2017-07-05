import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import SprettendeScrollbars from './sprettende-scrollbars';
import { autobind } from '../../../utils';

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
        this.state.clickIndex =
            Math.min(this.state.currentIndex, this.state.clickIndex) - 1;
        const scrollTo = this.state.clickIndex * KOLONNEBREDDE;
        this.scrollbars.scrollLeft(scrollTo);
    }

    visNeste() {
        const clientWidth = this.scrollbars.getClientWidth();
        const scrollLeft = this.scrollbars.getScrollLeft();
        const clientWidthWithOffset = clientWidth + KOLONNEMARGIN;
        const nesteIndex = Math.floor(
            (clientWidthWithOffset + scrollLeft) / KOLONNEBREDDE
        );
        this.state.clickIndex = Math.max(nesteIndex, this.state.clickIndex) + 1;
        const scrollTo =
            this.state.clickIndex * KOLONNEBREDDE - clientWidthWithOffset;
        this.scrollbars.scrollLeft(scrollTo);
    }

    updateState(values) {
        this.setState({
            currentIndex: Math.ceil(values.scrollLeft / KOLONNEBREDDE),
            venstreKnappDisabled: values.left === 0,
            hoyreKnappDisabled: values.left >= 0.99,
        });
    }

    render() {
        const { children, className } = this.props;

        const kolonner = children.map((child, index) =>
            <section key={child.key || index} className="tavle-kolonne">
                {child}
            </section>
        );

        const venstreKnapp = (
            <button
                className="tavle__scrollknapp knapp-forrige"
                onClick={this.visForrige}
                disabled={this.state.venstreKnappDisabled}
            />
        );

        const hoyreKnapp = (
            <button
                className="tavle__scrollknapp knapp-neste"
                onClick={this.visNeste}
                disabled={this.state.hoyreKnappDisabled}
            />
        );

        return (
            <section className={tavleClassname(className)}>
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
};

Tavle.defaultProps = {
    className: '',
};

export default Tavle;
