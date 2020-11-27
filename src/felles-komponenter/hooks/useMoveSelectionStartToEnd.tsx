import { useLayoutEffect } from 'react';

export function useMoveSelectionStartToEnd(className: string) {
    useLayoutEffect(() => {
        const el = document.getElementsByClassName(className)[0] as HTMLInputElement;
        if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = el.value.length;
        }
    }, [className]);
}
