import React, { useMemo } from "react";
import { guid } from "./guid";
import { createClassNames } from "./Palette";
export const BaseInput = React.forwardRef(({ jsStyle, componentName, labelContent, ...otherProps }, ref) => {
    const id = useMemo(() => guid(), []);
    return (React.createElement(React.Fragment, null,
        labelContent && React.createElement("label", { htmlFor: id }, labelContent),
        React.createElement("input", { id: id, "data-test-id": componentName ?? "BaseInput", ref: ref, className: createClassNames(jsStyle), ...otherProps })));
});
//# sourceMappingURL=BaseInput.js.map