import { useCallback, useEffect } from 'react';

export function useEventListener<T>(name: string, listener: (event: CustomEvent<T>) => void) {
    const callback = useCallback(
        (event: Event) => {
            if (event && 'detail' in event) {
                return listener(event as CustomEvent<T>);
            }
        },
        [listener]
    );
    useEffect(() => {
        window.addEventListener(name, callback);
        return () => window.removeEventListener(name, callback);
    }, [callback, name]);
}
