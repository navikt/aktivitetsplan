import React from 'react';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

ScrollToTop.propTypes = {
    location: PT.object.isRequired,
    children: PT.node.isRequired,
};

export default withRouter(ScrollToTop);
