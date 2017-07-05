import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router';
import NavLenkepanel from 'nav-frontend-lenkepanel';

function ReactRouterLink({ href, children, ...props }) {
    return (
        <Link to={href} {...props}>
            {children}
        </Link>
    );
}
ReactRouterLink.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired,
};

function Lenkepanel(props) {
    return <NavLenkepanel linkCreator={ReactRouterLink} {...props} />;
}

export default Lenkepanel;
