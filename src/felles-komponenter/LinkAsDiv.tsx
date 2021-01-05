import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
    to: string;
    children: ReactNode;
    className: string;
    id: string;
    ariaLabel: string;
    onClick(): void;
}

const LinkAsDiv = (props: Props) => {
    const { to, children, id, className, ariaLabel, onClick } = props;
    const history = useHistory();

    return (
        <div
            role="link"
            aria-label={ariaLabel}
            id={id}
            className={className}
            tabIndex={0}
            onClick={() => {
                history.push(to);
                onClick();
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    history.push(to);
                    onClick();
                }
            }}
        >
            {children}
        </div>
    );
};

export default LinkAsDiv;
