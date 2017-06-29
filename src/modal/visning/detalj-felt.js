import React from 'react';
import PT from 'prop-types';
import { EtikettLiten } from 'nav-frontend-typografi';
import visibleIfHOC from '../../hocs/visible-if';

function DetaljFelt({ tittel, children }) {
    return (
        <div className="aktivitetsdetaljer__felt detaljfelt">
            <EtikettLiten className="detaljfelt__tittel" tag="h2">{tittel}</EtikettLiten>
            {children}
        </div>
    );
}

DetaljFelt.propTypes = {
    children: PT.node.isRequired,
    tittel: PT.oneOfType([PT.string.isRequired, PT.node.isRequired]).isRequired,
};

export default visibleIfHOC(DetaljFelt);
