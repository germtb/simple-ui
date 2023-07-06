import React, { useRef, useState } from "react";
import { queryFocusables } from "./aria";
import { BaseView } from "./BaseView";
import { createClassNames, createJSStyles } from "./Styles";
import { useRefEffect } from "./useRefEffect";
const jsStyles = createJSStyles({
    root: {
        position: "relative",
    },
    popover: {
        zIndex: 1,
        backgroundColor: "var(--primary-background)",
        borderRadius: "var(--border-radius-m)",
        border: "1px solid var(--divider)",
        overflow: "hidden",
    },
});
export function Popover({ children, close }) {
    const activeElementRef = useRef(null);
    const focusTrapRoot = useRefEffect((root) => {
        activeElementRef.current = document.activeElement;
        const [element] = queryFocusables(root);
        element ? element.focus() : root.focus();
        const keydown = (e) => {
            if (e.key === "Escape") {
                close();
            }
            else if (e.key === "Tab") {
                const focusables = queryFocusables(root).filter((element) => element.tabIndex !== -1);
                if (focusables.length === 0) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                const focusedIndex = focusables.findIndex((x) => x === document.activeElement);
                if (focusables.length === 0) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                else if (focusedIndex === focusables.length - 1) {
                    // Cycle back to the first element
                    focusables[0].focus();
                    e.stopPropagation();
                    e.preventDefault();
                }
                else {
                    // Just do the usual thing
                }
            }
        };
        const click = () => {
            close();
        };
        window.addEventListener("keydown", keydown);
        // This is needed so that the trigger click is not captured immediatly, which would close the popover as it opens
        setTimeout(() => {
            window.addEventListener("click", click);
        }, 0);
        return () => {
            activeElementRef.current && activeElementRef.current.focus();
            window.removeEventListener("keydown", keydown);
            window.removeEventListener("click", click);
        };
    });
    return React.createElement(BaseView, { ref: focusTrapRoot }, children);
}
export function PopoverTrigger({ PopoverComponent, jsStyle, grow, shrink, tag, children, }) {
    const [popover, setPopover] = useState(null);
    const dialogRef = useRef(null);
    const toggle = (input) => {
        if (popover == null) {
            dialogRef && dialogRef.current.show();
            setPopover(React.createElement(PopoverComponent, { ...input, close: () => {
                    dialogRef && dialogRef.current.close();
                } }));
        }
        else {
            dialogRef && dialogRef.current.close();
        }
    };
    return (React.createElement(BaseView, { grow: grow, shrink: shrink, tag: tag, relative: true, jsStyle: [jsStyle, jsStyles.root] },
        children({ toggle }),
        React.createElement("dialog", { ref: (ref) => {
                dialogRef.current = ref;
            }, className: createClassNames(jsStyles.popover), onClose: () => {
                setPopover(null);
            }, onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
            } }, popover)));
}
//# sourceMappingURL=Popover.js.map