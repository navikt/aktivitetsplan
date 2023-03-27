import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Spring, SpringSystem } from 'rebound';

import { autobind } from '../../utils/utils';

interface Props {
    autoHeight: boolean;
    autoHeightMax: number;
    onScrollFrame: (values: { scrollLeft: number; left: number }) => void;
}

class SprettendeScrollbars extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        autobind(this);
    }

    private springSystem: SpringSystem | undefined;
    private spring: Spring | undefined;
    private scrollbars: Scrollbars | undefined | null;

    componentDidMount() {
        this.springSystem = new SpringSystem();
        this.spring = this.springSystem.createSpring();
        this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
    }

    componentWillUnmount() {
        this.springSystem?.deregisterSpring(this.spring!!);
        this.springSystem?.removeAllListeners();
        this.springSystem = undefined;
        this.spring?.destroy();
        this.spring = undefined;
    }

    getScrollLeft() {
        return this.scrollbars?.getScrollLeft();
    }

    getClientWidth() {
        return this.scrollbars?.getClientWidth();
    }

    scrollLeft(left: number) {
        const scrolLeft = this.scrollbars?.getScrollLeft();
        this.spring?.setCurrentValue(scrolLeft!!).setAtRest();
        this.spring?.setEndValue(left);
    }

    handleSpringUpdate(spring: Spring) {
        const val = spring.getCurrentValue();
        this.scrollbars?.scrollLeft(val);
    }

    render() {
        const { autoHeightMax, autoHeight, onScrollFrame } = this.props;
        return (
            <Scrollbars
                renderTrackHorizontal={() => <div></div>}
                renderTrackVertical={() => <div></div>}
                hidden={false}
                autoHeight={autoHeight}
                autoHeightMax={autoHeightMax}
                onScrollFrame={onScrollFrame}
                children={this.props.children}
                ref={(scrollbars) => {
                    this.scrollbars = scrollbars;
                }}
            />
        );
    }
}

export default SprettendeScrollbars;
