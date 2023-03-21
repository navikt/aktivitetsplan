import React from 'react';

interface LenkeknappProps {
    visible: boolean;
}

const NotifikasjonMarkering = ({ visible }: LenkeknappProps) => {
    if (!visible) {
        return null;
    }

    return <div className="mr-2 h-2.5 w-2.5 inline bg-[#0067c5] rounded-full"></div>;
};

export default NotifikasjonMarkering;
