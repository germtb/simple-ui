import React from "react";
import { createJSStyles, getBackground, } from "./Styles";
import { ListDivider } from "./ListDivider";
import { Row } from "./Row";
const jsStyles = createJSStyles({
    root: {
        position: "relative",
    },
});
export const BaseListRow = React.forwardRef(({ children, jsStyle, withDivider = true, backgroundColor = "primary-background", ...otherProps }, ref) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, { ...otherProps, ref: ref, tag: "li", role: "row", jsStyle: [jsStyles.root, getBackground(backgroundColor), jsStyle] }, children),
        withDivider && React.createElement(ListDivider, null)));
});
//# sourceMappingURL=BaseListRow.js.map