import { useCallback, useEffect } from 'react';

export function useEventListener(name: string, listener: (event: Event | CustomEvent) => void) {
    const callback = useCallback(listener, [listener]);
    useEffect(() => {
        window.addEventListener(name, callback);
        return () => window.removeEventListener(name, callback);
    }, [callback, name]);
}
