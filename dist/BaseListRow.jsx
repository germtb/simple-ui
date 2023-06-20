import React from "react";
import { createJSStyles, getBackground, } from "./Palette";
import { ListDivider } from "./ListDivider";
import { Row } from "./Row";
const jsStyles = createJSStyles({
    root: {
        position: "relative",
    },
});
export const BaseListRow = React.forwardRef(({ children, jsStyle, withDivider = true, backgroundColor = "primary-background", ...otherProps }, ref) => {
    return (<>
        <Row {...otherProps} ref={ref} tag="li" role="row" jsStyle={[jsStyles.root, getBackground(backgroundColor), jsStyle]}>
          {children}
        </Row>
        {withDivider && <ListDivider />}
      </>);
});
//# sourceMappingURL=BaseListRow.jsx.map