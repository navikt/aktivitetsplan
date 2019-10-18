import React from 'react';
import PT from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';

function Utskriftknapp({ lenke, className, history }) {
    return (
        <button
            type="button"
            className={className}
            aria-label="Skriv ut aktivitetsplanen"
            onClick={() => history.push(lenke)}
        />
    );
}

Utskriftknapp.defaultProps = {
    className: ''
};

Utskriftknapp.propTypes = {
    lenke: PT.string.isRequired,
    history: AppPT.history.isRequired,
    className: PT.string
};

export default withRouter(Utskriftknapp);
