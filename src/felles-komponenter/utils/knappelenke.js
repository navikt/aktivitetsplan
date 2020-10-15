import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import visibleIfHOC from '../../hocs/visible-if';

function Knappelenke({ onClick, className, ...rest }) {
    function click(e) {
        e.preventDefault();
        onClick(e);
    }

    return <button type="button" {...rest} className={classNames('knappelenke', className)} onClick={click} />;
}

Knappelenke.propTypes = {
    onClick: PT.func.isRequired,
    className: PT.string,
};

Knappelenke.defaultProps = {
    className: undefined,
};

export default visibleIfHOC(Knappelenke);
