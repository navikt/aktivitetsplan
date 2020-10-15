import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { SpringSystem } from 'rebound';
import { autobind } from '../../utils';

class SprettendeScrollbars extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    componentDidMount() {
        this.springSystem = new SpringSystem();
        this.spring = this.springSystem.createSpring();
        this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
    }

    componentWillUnmount() {
        this.springSystem.deregisterSpring(this.spring);
        this.springSystem.removeAllListeners();
        this.springSystem = undefined;
        this.spring.destroy();
        this.spring = undefined;
    }

    getScrollLeft() {
        return this.scrollbars.getScrollLeft();
    }

    getClientWidth() {
        return this.scrollbars.getClientWidth();
    }

    scrollLeft(left) {
        const scrolLeft = this.scrollbars.getScrollLeft();
        this.spring.setCurrentValue(scrolLeft).setAtRest();
        this.spring.setEndValue(left);
    }

    handleSpringUpdate(spring) {
        const val = spring.getCurrentValue();
        this.scrollbars.scrollLeft(val);
    }

    render() {
        return (
            <Scrollbars
                {...this.props}
                ref={(scrollbars) => {
                    this.scrollbars = scrollbars;
                }}
            />
        );
    }
}

SprettendeScrollbars.propTypes = {};

export default SprettendeScrollbars;
