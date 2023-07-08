import React from "react";
import { Box } from "./Box";
export function Circle({ jsStyle, padding = "medium", ...otherProps }) {
    return (React.createElement(Box, { padding: padding, jsStyle: [
            {
                borderRadius: "50%",
                overflow: "hidden",
            },
            jsStyle,
        ], ...otherProps }));
}
//# sourceMappingURL=Circle.js.map