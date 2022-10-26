import { useEffect, useState } from 'react';

const useIsVisible = (element: HTMLElement | null) => {
    const [isIntersecting, setIntersecting] = useState(false);

    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    useEffect(() => {
        if (!element) return;

        observer.observe(element);
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isIntersecting;
};

export default useIsVisible;
