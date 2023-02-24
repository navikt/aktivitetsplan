import { MutableRefObject, useEffect } from 'react';

export const useOutsideClick = <T extends HTMLElement>(
    ref: MutableRefObject<T | null>,
    callback: () => void,
    dep: boolean
) => {
    useEffect(() => {
        if (dep) {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains((event as any).target)) {
                    callback();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [callback, dep, ref]);
};
