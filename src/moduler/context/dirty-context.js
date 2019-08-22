import React, { useState } from 'react';
import PT from 'prop-types';

export const DirtyContext = React.createContext({
    isDirty: false,
    setIsDirty: () => {},
});

export function DirtyProvider({ children }) {
    const [isDirty, setIsDirty] = useState(false);

    return (
        <DirtyContext.Provider value={{ isDirty, setIsDirty }}>
            {children}
        </DirtyContext.Provider>
    );
}

DirtyProvider.propTypes = {
    children: PT.object.isRequired,
};
