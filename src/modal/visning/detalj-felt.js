import React from 'react';
import PT from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import visibleIfHOC from '../../hocs/visible-if';

function DetaljFelt({ tittel, children }) {
    return (
        <div className="aktivitetsdetaljer__felt detaljfelt">
            <Element className="detaljfelt__tittel">{tittel}</Element>
            {children}
        </div>
    );
}

DetaljFelt.propTypes = {
    children: PT.node.isRequired,
    tittel: PT.oneOfType([PT.string.isRequired, PT.node.isRequired]).isRequired
};

export default visibleIfHOC(DetaljFelt);
