import './demoIkon.less';

import React from 'react';

export function DemoIkon({ onClick }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={110} width={110} className="demo-ikon" onClick={onClick}>
            <polygon points="0,0 110,0 110,110" />
            <text x={40} y={10} transform="rotate(45 20,40)">
                DEMO
            </text>
        </svg>
    );
}
