import React, { useRef, useState } from "react";
import { BaseView } from "./BaseView";
import { createJSStyles } from "./Palette";
import { queryFocusables } from "./aria";
import { useRefEffect } from "./useRefEffect";
import { useNavigation } from "./useNavigation";
const jsStyles = createJSStyles({
    popover: {
        position: "absolute",
        backgroundColor: "var(--primary-background)",
        borderRadius: "var(--border-radius-m)",
        zIndex: 1,
        border: "1px solid var(--divider)",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        display: "flex",
    },
    header: {
        gridArea: "header",
    },
    content: {
        gridArea: "content",
    },
});
export function Popover({ children, close }) {
    const activeElementRef = useRef(null);
    const focusTrapRoot = useRefEffect((root) => {
        activeElementRef.current = document.activeElement;
        const [element] = queryFocusables(root);
        element && element.focus();
        const keydown = (e) => {
            if (e.key === "Escape") {
                close();
            }
            else if (e.key === "Tab") {
                e.stopPropagation();
                e.preventDefault();
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
    // const refCallback = useRefEffect((root: HTMLDialogElement) => {
    //   activeElementRef.current = document.activeElement;
    //   const [element] = queryFocusables(root);
    //   element && element.focus();
    //   const onKeyDown = (e) => {
    //     if (e.key === "Tab") {
    //       const elements = queryFocusables(root);
    //       if (elements.length === 0) {
    //         return;
    //       }
    //       const first = elements[0];
    //       const last = elements[elements.length - 1];
    //       console.log({
    //         first: first === document.activeElement,
    //         last: last === document.activeElement,
    //       });
    //       if (e.shiftKey && document.activeElement === first) {
    //         e.preventDefault();
    //         last.focus();
    //       } else if (!e.shiftKey && document.activeElement === last) {
    //         e.preventDefault();
    //         first.focus();
    //       } else if (!e.shiftKey) {
    //         const index = elements.findIndex((e) => e === document.activeElement);
    //         console.log({ index });
    //         if (index === -1) {
    //           console.error("Tab not currently trapped in popover");
    //         } else {
    //           const nextElement = elements[index + 1];
    //           console.log({ nextElement });
    //           nextElement.focus();
    //         }
    //       }
    //     }
    //   };
    //   root.addEventListener("keydown", onKeyDown);
    //   return () => {
    //     root.removeEventListener("keydown", onKeyDown);
    //   };
    // });
    const navigationRoot = useNavigation();
    return (React.createElement(BaseView, { ref: focusTrapRoot, jsStyle: jsStyles.popover },
        React.createElement(BaseView, { ref: navigationRoot }, children)));
}
export function PopoverTrigger({ PopoverComponent, jsStyle, className, grow, shrink, tag, children, }) {
    const [popover, setPopover] = useState(null);
    const close = () => {
        setPopover(null);
    };
    const toggle = (input) => {
        if (popover == null) {
            setPopover(React.createElement(PopoverComponent, { ...input, close: close }));
        }
        else {
            close();
        }
    };
    return (React.createElement(BaseView, { style: { position: "relative" }, className: className, grow: grow, shrink: shrink, tag: tag, relative: true, jsStyle: jsStyle },
        children({ toggle }),
        popover));
}
//# sourceMappingURL=Popover.js.map