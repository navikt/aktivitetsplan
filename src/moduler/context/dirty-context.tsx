import React, { useState, useCallback, useMemo } from 'react';
import PT from 'prop-types';

export const DirtyContext = React.createContext({
    isDirty: false,
    setFormIsDirty: (name: string, dirty: boolean) => {}
});

function isFormsDirty(forms) {
    return Object.values(forms).some(value => value === true);
}

export function DirtyProvider({ children }) {
    const [isDirty, setIsDirty] = useState(false);
    const [, setDirtyForms] = useState({});

    const setFormIsDirty = useCallback(
        (name, dirty) => {
            setDirtyForms(forms => {
                const newForm = { ...forms, [name]: dirty };
                setIsDirty(isFormsDirty(newForm));
                return newForm;
            });
        },
        [setDirtyForms, setIsDirty]
    );

    const value = useMemo(() => ({ isDirty, setFormIsDirty }), [isDirty, setFormIsDirty]);
    return <DirtyContext.Provider value={value}>{children}</DirtyContext.Provider>;
}

DirtyProvider.propTypes = {
    children: PT.object.isRequired
};
