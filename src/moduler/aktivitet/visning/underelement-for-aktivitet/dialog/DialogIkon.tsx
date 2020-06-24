import React from 'react';

function DialogIkonUtenUleste() {
    return (
        <svg className="dialogIkonUtenUleste" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <g stroke="#0067C5" fill="none">
                <path d="M7.44 14.56A9.01 9.01 0 016 14.25l-5 2 2-3.5A6.53 6.53 0 01.5 7.69C.5 3.86 4.3.75 9 .75s8.5 3.1 8.5 6.94" />
                <path d="M9.5 16.25c0 4.29 5 7.5 9.5 5.5l4 1.5-1.5-3a5 5 0 002-4c0-3.15-3.13-6-7-6s-7 2.85-7 6z" />
            </g>
        </svg>
    );
}

function DialogIkonMedUleste(props: Props) {
    const antall = props.antallUleste;
    const xPos = antall > 9 ? 23 : 26.8;

    return (
        <div>
            <svg className="dialogIkonMedUleste" xmlns="http://www.w3.org/2000/svg" width="40" height="32">
                <svg y="8">
                    <path
                        fill="#0067C5"
                        d="M16.5 8.75c.48 0 .94.04 1.4.12.06-.38.1-.78.1-1.18 0-4.1-4.04-7.44-9-7.44S0 3.58 0 7.68c0 1.97.85 3.83 2.36 5.18L.56 16a.5.5 0 00.63.71l4.84-1.93c.43.12.88.22 1.34.28h.08l.68-.02c.67-3.51 4.23-6.29 8.37-6.29z"
                    />
                    <path
                        fill="#0067C5"
                        d="M16.5 9.75c-4.07 0-7.5 2.98-7.5 6.5 0 3.35 2.88 6.22 6.43 6.57h.01c1.3.13 2.57-.11 3.57-.53l3.81 1.43a.5.5 0 00.63-.7l-1.33-2.64A5.46 5.46 0 0024 16.25c0-3.52-3.43-6.5-7.5-6.5z"
                    />
                </svg>
                <circle opacity="1" fill="#c30000" cx="30" cy="10" r="10" />
                <text x={xPos} y="14.4" fill="#fff" opacity="1">
                    {antall}
                </text>
            </svg>
            <div className="sr-only">
                Aktiviteten har en dialog
            </div>
        </div>
    );
}

interface Props {
    antallUleste: number;
}

function DialogIkon(props: Props) {
    const antallUleste = props.antallUleste;
    if (antallUleste === 0) {
        return <DialogIkonUtenUleste />;
    }
    return <DialogIkonMedUleste antallUleste={antallUleste} />;
}

export default DialogIkon;
