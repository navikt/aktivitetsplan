import PT from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
        const { location } = this.props;
        if (location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        const { children } = this.props;
        return children;
    }
}

ScrollToTop.propTypes = {
    location: PT.object.isRequired,
    children: PT.node.isRequired,
};

export default withRouter(ScrollToTop);
