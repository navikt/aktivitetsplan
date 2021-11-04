import React from 'react';

interface DialogIkonUtenUlesteProps {
    className?: string;
}

function DialogIkonUtenUleste(props: DialogIkonUtenUlesteProps) {
    const { className } = props;

    return (
        <svg
            className={className}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 13.518L4.602 12H6v-1a4 4 0 014-4h6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v9.518zM5.143 14H6v3a4 4 0 004 4h8.857L24 24V11a4 4 0 00-4-4h-2V4a4 4 0 00-4-4H4a4 4 0 00-4 4v13l5.143-3zm14.255 5L22 20.518V11a2 2 0 00-2-2H10a2 2 0 00-2 2v6a2 2 0 002 2h9.398zM11 15a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2z"
                fill="#0067C5"
            />
        </svg>
    );
}

interface DialogIkonMedUlesteProps {
    antallUleste: number;
    className?: string;
}

function DialogIkonMedUleste(props: DialogIkonMedUlesteProps) {
    const { antallUleste, className } = props;
    const xPos = antallUleste > 9 ? 23 : 26.8;

    return (
        <div>
            <svg
                className={className}
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="32"
                focusable="false"
                role="img"
            >
                <svg y="8">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2 13.518L4.602 12H6v-1a4 4 0 014-4h6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v9.518zM5.143 14H6v3a4 4 0 004 4h8.857L24 24V11a4 4 0 00-4-4h-2V4a4 4 0 00-4-4H4a4 4 0 00-4 4v13l5.143-3zm14.255 5L22 20.518V11a2 2 0 00-2-2H10a2 2 0 00-2 2v6a2 2 0 002 2h9.398zM11 15a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2z"
                        fill="#0067C5"
                    />
                </svg>
                <circle opacity="1" fill="#c30000" cx="30" cy="10" r="10" />
                <text x={xPos} y="14.4" fill="#fff" opacity="1">
                    {antallUleste}
                </text>
            </svg>
            <div className="sr-only">Aktiviteten har en dialog</div>
        </div>
    );
}

interface DialogIkonProps {
    antallUleste: number;
    classNameUtenUleste?: string;
    classNameMedUleste?: string;
}

function DialogIkon(props: DialogIkonProps) {
    const { antallUleste, classNameUtenUleste, classNameMedUleste } = props;
    if (antallUleste === 0) {
        return <DialogIkonUtenUleste className={classNameUtenUleste} />;
    }
    return <DialogIkonMedUleste antallUleste={antallUleste} className={classNameMedUleste} />;
}

export default DialogIkon;
