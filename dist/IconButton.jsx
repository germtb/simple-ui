import React from "react";
import { BaseButton } from "./BaseButton";
import { Icon } from "./Icon";
import { createJSStyles } from "./Palette";
const jsStyles = createJSStyles({
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    animation: {
        ":active": {
            transform: "scale(0.92)",
        },
    },
    small: {
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    medium: {
        height: 32,
        width: 32,
        borderRadius: 16,
    },
    large: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
const getIconColor = (color, disabled, bare) => {
    if (disabled) {
        return "subtle";
    }
    switch (color) {
        case "positive":
            return bare ? "highlight" : "light";
        case "negative":
            return bare ? "negative" : "light";
        case "secondary":
            return bare ? "primary" : "secondary";
    }
};
export const IconButton = React.forwardRef(({ icon, size, color, bare, disabled, ...buttonProps }, ref) => {
    return (<BaseButton {...buttonProps} bare={bare} jsStyle={[
            jsStyles.button,
            size === "small" && jsStyles.small,
            size === "medium" && jsStyles.medium,
            size === "large" && jsStyles.large,
            !disabled && jsStyles.animation,
        ]} color={color} ref={ref} disabled={disabled}>
        <Icon size={size} icon={icon} color={getIconColor(color, disabled, bare)}/>
      </BaseButton>);
});
//# sourceMappingURL=IconButton.jsx.map