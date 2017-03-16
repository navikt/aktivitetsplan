import React, { PropTypes as PT } from 'react';
import { EtikettLiten } from 'nav-react-design/dist/typografi';
import { visibleIfHOC } from '../../hocs/visible-if';

function DetaljFelt({ tittel, children }) {
    return (
        <div className="aktivitetsdetaljer__felt detaljfelt">
            <EtikettLiten className="detaljfelt__tittel">{tittel}</EtikettLiten>
            {children}
        </div>
    );
}

DetaljFelt.propTypes = {
    children: PT.node.isRequired,
    tittel: PT.string.isRequired
};

export default visibleIfHOC(DetaljFelt);
