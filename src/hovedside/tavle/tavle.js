import classNames from 'classnames';
import PT from 'prop-types';
import React, { Component } from 'react';

import { autobind } from '../../utils';
import SprettendeScrollbars from './sprettende-scrollbars';

const KOLONNEBREDDE = 300;
const KOLONNEMARGIN = 10;
const tavleClassname = (className) => classNames('tavle', className);

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
        const { currentIndex, clickIndex } = this.state;
        const newClickIndex = Math.min(currentIndex, clickIndex) - 1;
        const scrollTo = newClickIndex * KOLONNEBREDDE;
        this.scrollbars.scrollLeft(scrollTo);
        this.setState({ clickIndex: newClickIndex });
    }

    visNeste() {
        const { clickIndex } = this.state;
        const clientWidth = this.scrollbars.getClientWidth();
        const scrollLeft = this.scrollbars.getScrollLeft();
        const clientWidthWithOffset = clientWidth + KOLONNEMARGIN;
        const nesteIndex = Math.floor((clientWidthWithOffset + scrollLeft) / KOLONNEBREDDE);
        const newClickIndex = Math.max(nesteIndex, clickIndex) + 1;
        const scrollTo = newClickIndex * KOLONNEBREDDE - clientWidthWithOffset;
        this.scrollbars.scrollLeft(scrollTo);
        this.setState({ clickIndex: newClickIndex });
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
        const { venstreKnappDisabled, hoyreKnappDisabled } = this.state;

        const kolonner = children.map((child, index) => (
            <section
                key={child.key || index}
                className="tavle-kolonne"
                data-testid={`aktivitetstavle.${child.props.status}`}
            >
                {child}
            </section>
        ));

        const venstreKnapp = (
            <button
                type="button"
                className={classNames('tavle__scrollknapp knapp-forrige', {
                    invisible: venstreKnappDisabled,
                })}
                onClick={this.visForrige}
                disabled={venstreKnappDisabled}
                aria-label="Flytt visning en kolonne til venstre"
            />
        );

        const hoyreKnapp = (
            <button
                type="button"
                className={classNames('tavle__scrollknapp knapp-neste', {
                    invisible: hoyreKnappDisabled,
                })}
                onClick={this.visNeste}
                hidden={hoyreKnappDisabled}
                aria-label="Flytt visning en kolonne til høyre"
            />
        );

        return (
            <section className={tavleClassname(className)} tabIndex="-1">
                {venstreKnapp}
                <SprettendeScrollbars
                    renderTrackHorizontal={() => <div />}
                    className="tavle__scrollarea"
                    autoHeight
                    autoHeightMax={9999}
                    onScrollFrame={this.updateState}
                    ref={(scrollbars) => {
                        this.scrollbars = scrollbars;
                    }}
                >
                    <div className="kolonner">{kolonner}</div>
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
