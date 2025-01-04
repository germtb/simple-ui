import { useRef, useCallback } from "react";
export function OnVisible({ children, onVisible, }) {
    const intersectionObserverRef = useRef(null);
    const refCallback = useCallback((element) => {
        if (element == null) {
            return;
        }
        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting || entry.intersectionRatio > 0) {
                    onVisible();
                }
            });
        }, {
            root: null,
            rootMargin: "0px",
        });
        intersectionObserverRef.current = intersectionObserver;
        intersectionObserver.observe(element);
        return () => {
            intersectionObserver.unobserve(element);
            intersectionObserverRef.current = null;
        };
        // eslint-disable-next-line
    }, [onVisible]);
    return children(refCallback);
}
//# sourceMappingURL=OnVisible.js.map