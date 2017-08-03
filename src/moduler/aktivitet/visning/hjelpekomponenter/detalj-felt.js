import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { EtikettLiten } from 'nav-frontend-typografi';
import visibleIfHOC from '../../../../hocs/visible-if';

function DetaljFelt({ tittel, children, fullbredde }) {
    return (
        <div
            className={classNames(
                'aktivitetsdetaljer__felt',
                'detaljfelt',
                fullbredde && 'detaljfelt--fullbredde'
            )}
        >
            <EtikettLiten className="detaljfelt__tittel" tag="h2">
                {tittel}
            </EtikettLiten>
            {children}
        </div>
    );
}

DetaljFelt.defaultProps = {
    fullbredde: false,
};

DetaljFelt.propTypes = {
    children: PT.node.isRequired,
    tittel: PT.oneOfType([PT.string.isRequired, PT.node.isRequired]).isRequired,
    fullbredde: PT.bool.isRequired,
};

export default visibleIfHOC(DetaljFelt);
