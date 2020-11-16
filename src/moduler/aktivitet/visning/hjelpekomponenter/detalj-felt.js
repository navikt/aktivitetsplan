import classNames from 'classnames';
import { EtikettLiten } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import visibleIfHOC from '../../../../hocs/visible-if';

function DetaljFelt({ tittel, children, fullbredde, beskrivelse }) {
    return (
        <div
            className={classNames('aktivitetsdetaljer__felt', 'detaljfelt', {
                'detaljfelt--fullbredde': fullbredde,
                'detaljfelt--beskrivelse': beskrivelse,
            })}
        >
            <EtikettLiten className="detaljfelt__tittel" tag="h2">
                {tittel}
            </EtikettLiten>
            {children}
        </div>
    );
}

DetaljFelt.defaultProps = {
    beskrivelse: false,
};

DetaljFelt.propTypes = {
    children: PT.node.isRequired,
    tittel: PT.oneOfType([PT.string.isRequired, PT.node.isRequired]).isRequired,
    fullbredde: PT.bool.isRequired,
    beskrivelse: PT.bool,
};

export default visibleIfHOC(DetaljFelt);
