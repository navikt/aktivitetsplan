import React from 'react';
import PT from 'prop-types';
import { autobind } from '../../../utils';

class HoverBilde extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: props.imgSrc,
            altText: props.altText,
            className: props.className,
        };
        autobind(this);
    }

    handleMouseEnter() {
        this.setState({
            source: this.props.imgSrcHover,
        });
    }

    handleMouseLeave() {
        this.setState({
            source: this.props.imgSrc,
        });
    }

    render() {
        return (
            <img
                className={this.state.className}
                alt={this.state.altText}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                src={this.state.source}
            />
        );
    }
}

HoverBilde.propTypes = {
    className: PT.string,
    imgSrc: PT.string,
    imgSrcHover: PT.string,
    altText: PT.string,
};

HoverBilde.defaultProps = {
    className: undefined,
    imgSrc: undefined,
    imgSrcHover: undefined,
    altText: undefined,
};

export default HoverBilde;
