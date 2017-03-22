import React, { PropTypes as PT } from 'react';
import { Link } from 'react-router';
import "./lukk-knapp.less";

function LukkKnapp({ href = '/' }) {
    return (
        <Link to={href} className="lukk-knapp">
            <span className="vekk">Lukk-knapp</span>
        </Link>
    );
}

LukkKnapp.propTypes = {
    href: PT.string
};

export default LukkKnapp;
