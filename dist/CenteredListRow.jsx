import React from "react";
import { BaseListRow } from "./BaseListRow";
import { createJSStyles, grow } from "./Palette";
const jsStyles = createJSStyles({
    root: {
        position: "relative",
        padding: "var(--spacing-m)",
    },
});
export const CenteredListRow = React.forwardRef((props, ref) => {
    return (<BaseListRow {...props} align="center" justify="center" jsStyle={[props.jsStyle, jsStyles.root, grow]} ref={ref} withDivider={false}/>);
});
//# sourceMappingURL=CenteredListRow.jsx.map