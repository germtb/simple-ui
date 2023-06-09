import React from "react";
import { BaseView } from "./BaseView";
export const ListCell = React.forwardRef((props, ref) => {
    return (<BaseView {...props} componentName={(props.componentName ?? []).concat("ListCell")} role="gridcell" ref={ref}/>);
});
//# sourceMappingURL=ListCell.jsx.map