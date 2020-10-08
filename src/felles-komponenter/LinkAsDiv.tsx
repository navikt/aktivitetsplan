import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
    to: string;
    children: ReactNode;
    className: string;
    id: string;
    onClick(): void;
}

function LinkAsDiv(props: Props) {
    const { to, children, id, className, onClick } = props;
    const history = useHistory();

    return (
        <div
            role="link"
            id={id}
            className={className}
            tabIndex={0}
            onClick={() => {
                history.push(to);
                onClick();
            }}
        >
            {children}
        </div>
    );
}

export default LinkAsDiv;
