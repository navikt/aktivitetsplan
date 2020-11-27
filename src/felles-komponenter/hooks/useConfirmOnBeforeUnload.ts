import { MutableRefObject, useEffect } from 'react';

export const CONFIRM = 'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

export const useConfirmOnBeforeUnload = (isDirty: MutableRefObject<boolean>) =>
    useEffect(() => {
        window.onbeforeunload = (e: BeforeUnloadEvent) => {
            if (isDirty.current) {
                e.returnValue = CONFIRM;
                return CONFIRM;
            }
            return undefined;
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, [isDirty]);
