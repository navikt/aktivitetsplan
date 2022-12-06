import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    return (
        <div
            role="link"
            aria-label={ariaLabel}
            id={id}
            className={className}
            tabIndex={0}
            onClick={() => {
                navigate(to);
                onClick();
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    navigate(to);
                    onClick();
                }
            }}
        >
            {children}
        </div>
    );
};

export default LinkAsDiv;
