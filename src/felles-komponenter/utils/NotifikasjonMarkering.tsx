import React from 'react';

interface LenkeknappProps {
    visible: boolean;
}

const NotifikasjonMarkering = ({ visible }: LenkeknappProps) => {
    if (!visible) {
        return null;
    }

    return (
        <div className="w-2.5 m-1">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <title>Ulest aktivitet</title>
                <circle cx="50" cy="50" r="50" fill="#0067c5" />
            </svg>
        </div>
    );
};

export default NotifikasjonMarkering;
