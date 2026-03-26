import React, { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    to: string;
    children: ReactNode;
    className: string;
    id: string;
    ariaLabel: string;
    onClick(): void;
    style?: CSSProperties;
}

const LinkAsDiv = (props: Props) => {
    const { to, children, id, className, ariaLabel, onClick, style } = props;
    const navigate = useNavigate();

    return (
        <div
            role="link"
            aria-label={ariaLabel}
            id={id}
            className={className}
            style={style}
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
