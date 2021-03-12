import classNames from 'classnames';
import React from 'react';

import visibleIfHOC from '../../hocs/visible-if';

interface Props {
    className?: string;
    role?: string;
    tabIndex?: number;
    hidden?: boolean;
    onClick(e: React.MouseEvent): void;
}

const Knappelenke = (props: Props) => {
    const { onClick, role, className, ...rest } = props;

    const click = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(e);
    };

    return <button type="button" {...rest} className={classNames('knappelenke', className)} onClick={click} />;
};

export default visibleIfHOC(Knappelenke);
